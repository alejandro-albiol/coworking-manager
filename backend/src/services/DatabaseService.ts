import { Pool, PoolClient } from 'pg';
import { DataBaseResponse } from '../models/responses/DataBaseResponse';
import { config } from '../config/database';

export class DatabaseService {
    private static pool: Pool;

    private static getPool(): Pool {
        if (!this.pool) {
            const dbConfig = config.database;
            console.log('DB Config:', {
                ...dbConfig,
                password: dbConfig.password ? 'REDACTED' : 'undefined'
            });
            
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

    static async getTenant(query: string, values: any[]): Promise<DataBaseResponse<any>> {
        try {
            const clientResponse = await DatabaseService.getClient(process.env.DEFAULT_SCHEMA || '');
            if (!clientResponse.isSuccess) {
                throw new Error('Database connection failed');
            }
            const client = clientResponse.data;
            if (!client) {
                throw new Error('Database connection failed');
            }
            const result = await client.query(query, values);
            return { 
                isSuccess: true, 
                message: 'Tenant found successfully', 
                data: result.rows[0] 
            };
        } catch (error) {
            return { 
                isSuccess: false, 
                message: 'Failed to find tenant', 
                data: null 
            };
        }
    }
}