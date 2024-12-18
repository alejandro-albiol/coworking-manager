import { QueryResult, PoolClient, Pool } from "pg";
import { DataBaseResponse } from "../../models/responses/DataBaseResponse";

export interface IDatabase {
    // Conexión
    getClient(schema: string): Promise<DataBaseResponse<PoolClient>>;
    getPool(): Pool;
    
    // Operaciones básicas
    query(schema: string, query: string, params: any[]): Promise<QueryResult>;
    queryWithClient(client: PoolClient, query: string, params: any[]): Promise<QueryResult>;
    
    // Transacciones
    beginTransaction(client: PoolClient): Promise<void>;
    commit(client: PoolClient): Promise<void>;
    rollback(client: PoolClient): Promise<void>;
    
    // Gestión de conexiones
    release(client: PoolClient): void;
    disconnect(): Promise<void>;
    
    // Gestión de schemas
    setSchema(client: PoolClient, schema: string): Promise<void>;
    createSchema(schema: string): Promise<void>;
    
    // Errores y estado
    isConnected(): boolean;
    getLastError(): Error | null;
} 