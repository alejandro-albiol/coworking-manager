import { Pool, PoolClient } from 'pg';
import { DataBaseResponse } from '../models/responses/DataBaseResponse';
import { config } from '../config/database';
import { ITenant } from '../models/interfaces/entities/ITenant';
import fs from 'fs/promises';
import path from 'path';

export class DatabaseService {
    private static pool: Pool;

    private static getPool(): Pool {
        if (!this.pool) {
            const dbConfig = config.database;
            this.pool = new Pool({
                host: dbConfig.host,
                port: dbConfig.port,
                user: dbConfig.user,
                password: dbConfig.password,
                database: dbConfig.name
            });
        }
        return this.pool;
    }

    static async getClient(schema: string): Promise<DataBaseResponse<PoolClient>> {
        try {
            const client = await this.getPool().connect();
            await client.query(`SET search_path TO ${schema}`);
            return {
                isSuccess: true,
                message: 'Database connection successful',
                data: client
            };
        } catch (error) {
            console.error('DB Connection error:', error);
            return { isSuccess: false, message: 'Database connection failed', data: null };
        }
    }

    static async getTenant(subdomain: string): Promise<DataBaseResponse<ITenant>> {
        const client = await this.getPool().connect();
        try {
            const result = await client.query(
                'SELECT * FROM public.tenants WHERE subdomain = $1',
                [subdomain]
            );
            return {
                isSuccess: true,
                message: 'Tenant found',
                data: result.rows[0] || null
            };
        } catch (error) {
            return {
                isSuccess: false,
                message: 'Tenant not found',
                data: null
            };
        } finally {
            client.release();
        }
    }

    static async createTenant(tenant: { subdomain: string; name: string }): Promise<DataBaseResponse<ITenant>> {
        const client = await this.getPool().connect();
        try {
            await client.query('BEGIN');

            const schemaName = `tenant_${tenant.subdomain}`;
            const result = await client.query(
                'INSERT INTO public.tenants (subdomain, schema_name, name) VALUES ($1, $2, $3) RETURNING *',
                [tenant.subdomain, schemaName, tenant.name]
            );

            await client.query(`CREATE SCHEMA IF NOT EXISTS ${schemaName}`);
            await client.query(`SET search_path TO ${schemaName}`);

            const initScript = await fs.readFile(
                path.join(__dirname, '../database/scripts/initTenantSchema.sql'),
                'utf8'
            );
            await client.query(initScript);

            await client.query('COMMIT');
            return {
                isSuccess: true,
                message: 'Tenant created successfully',
                data: result.rows[0]
            };

        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error creating tenant:', error);
            return {
                isSuccess: false,
                message: 'Failed to create tenant',
                data: null
            };
        } finally {
            client.release();
        }
    }
}