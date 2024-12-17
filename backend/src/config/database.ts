import dotenv from 'dotenv';
import path from 'path';

const validEnvironments = ['development', 'test', 'production'] as const;
const environment = process.env.NODE_ENV as typeof validEnvironments[number];

if (environment && !validEnvironments.includes(environment)) {
    console.warn(`Invalid NODE_ENV: ${environment}. Using 'development'`);
}

const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

export const config = {
    environment: environment || 'development',
    database: {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432'),
        name: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        defaultSchema: process.env.DEFAULT_SCHEMA || 'public'
    }
};