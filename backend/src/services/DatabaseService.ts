import { Pool, PoolClient } from 'pg';

export class DatabaseService {
    private static pool: Pool;

    constructor(pool: Pool) {
        DatabaseService.pool = pool;
    }

    public static async getClient(schema: string): Promise<PoolClient> {
        const client = await DatabaseService.pool.connect();
        await client.query(`SET search_path TO ${schema}`);
        return client;
    }
}