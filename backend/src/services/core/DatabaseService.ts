import { Pool, PoolClient, QueryResult } from 'pg';
import { ITenant } from '../../models/entities/tenant/ITenant';
import fs from 'fs/promises';
import path from 'path';
import { IDatabase } from '../../interfaces/database/IDatabase';

export class DatabaseService implements IDatabase {
    public readonly pool: Pool;
    private lastError: Error | null = null;

    constructor() {
        this.pool = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: Number(process.env.DB_PORT)
        });
    }

    getPool(): Pool {
        return this.pool;
    }

    async getClient(schema: string): Promise<PoolClient> {
        try {
            const client = await this.getPool().connect();
            await this.setSchema(client, schema);
            return client;
        } catch (error) {
            this.lastError = error as Error;
            console.error('DB Connection error:', error);
            throw error;
        }
    }

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

    async beginTransaction(client: PoolClient): Promise<void> {
        await client.query('BEGIN');
    }

    async commit(client: PoolClient): Promise<void> {
        await client.query('COMMIT');
    }

    async rollback(client: PoolClient): Promise<void> {
        await client.query('ROLLBACK');
    }

    release(client: PoolClient): void {
        if (client) {
            client.release();
        }
    }

    async disconnect(): Promise<void> {
        if (this.pool) {
            await this.pool.end();
        }
    }

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

    isConnected(): boolean {
        return this.pool !== undefined && !this.pool.ended;
    }

    getLastError(): Error | null {
        return this.lastError;
    }

    async getTenant(subdomain: string): Promise<ITenant | null> {
        const client = await this.getPool().connect();
        try {
            const result = await client.query(
                'SELECT * FROM public.tenants WHERE subdomain = $1',
                [subdomain]
            );
            return result.rows[0] || null;
        } catch (error) {
            throw error;
        } finally {
            client.release();
        }
    }

    async createTenant(tenant: { subdomain: string; name: string }): Promise<ITenant | null> {
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
            return result.rows[0] || null;

        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error creating tenant:', error);
            throw error;
        } finally {
            client.release();
        }
    }
}