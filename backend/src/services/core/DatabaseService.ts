import { Pool, PoolClient, QueryResult } from 'pg';
import { DataBaseResponse } from '../../models/responses/DataBaseResponse';
import { config } from '../../config/database';
import { ITenant } from '../../models/entities/tenant/ITenant';
import fs from 'fs/promises';
import path from 'path';
import { IDatabase } from '../../interfaces/database/IDatabase';

export class DatabaseService implements IDatabase {
    private static pool: Pool;
    private lastError: Error | null = null;

    // Método estático para uso interno
    private static getPool(): Pool {
        if (!DatabaseService.pool) {
            const dbConfig = config.database;
            DatabaseService.pool = new Pool({
                host: dbConfig.host,
                port: dbConfig.port,
                user: dbConfig.user,
                password: dbConfig.password,
                database: dbConfig.name
            });
        }
        return DatabaseService.pool;
    }

    // Método de instancia para la interfaz
    getPool(): Pool {
        return DatabaseService.getPool();
    }

    async getClient(schema: string): Promise<DataBaseResponse<PoolClient>> {
        try {
            const client = await this.getPool().connect();
            await this.setSchema(client, schema);
            return {
                isSuccess: true,
                message: 'Database connection successful',
                data: client
            };
        } catch (error) {
            this.lastError = error as Error;
            console.error('DB Connection error:', error);
            return { isSuccess: false, message: 'Database connection failed', data: null };
        }
    }

    // Operaciones básicas
    async query(schema: string, query: string, params: any[]): Promise<QueryResult> {
        const client = await this.getPool().connect();
        try {
            await this.setSchema(client, schema);
            return await client.query(query, params);
        } catch (error) {
            this.lastError = error as Error;
            throw error;
        } finally {
            client.release();
        }
    }

    async queryWithClient(client: PoolClient, query: string, params: any[]): Promise<QueryResult> {
        try {
            return await client.query(query, params);
        } catch (error) {
            this.lastError = error as Error;
            throw error;
        }
    }

    // Transacciones
    async beginTransaction(client: PoolClient): Promise<void> {
        await client.query('BEGIN');
    }

    async commit(client: PoolClient): Promise<void> {
        await client.query('COMMIT');
    }

    async rollback(client: PoolClient): Promise<void> {
        await client.query('ROLLBACK');
    }

    // Gestión de conexiones
    release(client: PoolClient): void {
        if (client) {
            client.release();
        }
    }

    async disconnect(): Promise<void> {
        if (DatabaseService.pool) {
            await DatabaseService.pool.end();
        }
    }

    // Gestión de schemas
    async setSchema(client: PoolClient, schema: string): Promise<void> {
        await client.query(`SET search_path TO ${schema}`);
    }

    async createSchema(schema: string): Promise<void> {
        const client = await this.getPool().connect();
        try {
            await client.query(`CREATE SCHEMA IF NOT EXISTS ${schema}`);
        } catch (error) {
            this.lastError = error as Error;
            throw error;
        } finally {
            client.release();
        }
    }

    // Errores y estado
    isConnected(): boolean {
        return DatabaseService.pool !== undefined && !DatabaseService.pool.ended;
    }

    getLastError(): Error | null {
        return this.lastError;
    }

    static async getTenant(subdomain: string): Promise<DataBaseResponse<ITenant>> {
        const client = await DatabaseService.getPool().connect();
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
        const client = await DatabaseService.getPool().connect();
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