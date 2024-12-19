import { Pool, PoolClient } from 'pg';

export class Database {
    private readonly pool: Pool;

    constructor() {
        this.pool = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: Number(process.env.DB_PORT)
        });
    }

    async getClient(schema: string): Promise<PoolClient> {
        const client = await this.pool.connect();
        await client.query(`SET search_path TO ${schema}`);
        return client;
    }

    async query(schema: string, text: string, params?: any[]) {
        const client = await this.getClient(schema);
        try {
            return await client.query(text, params);
        } finally {
            client.release();
        }
    }
}
