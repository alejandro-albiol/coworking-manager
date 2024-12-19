import { BaseRepository } from "./base/BaseRepository";
import { IRole } from "../models/entities/auth/IRole";
import { ICreateRoleDto } from "../interfaces/dtos/auth/role/ICreateRoleDto";
import { IUpdateRoleDto } from "../interfaces/dtos/auth/role/IUpdateRoleDto";

export class RoleRepository extends BaseRepository<IRole, ICreateRoleDto, IUpdateRoleDto> {
    async create(role: ICreateRoleDto, schema: string): Promise<IRole> {
        let client;
        try {
            client = await this.database.getClient(schema);
            
            const result = await this.database.query(
                schema,
                'INSERT INTO roles (name, description) VALUES ($1, $2) RETURNING *',
                [role.name, role.description]
            );

            if (!result?.rows?.[0]) {
                throw new Error('Failed to create role');
            }

            return result.rows[0];
        } catch (error) {
            throw error instanceof Error 
                ? error 
                : new Error('Unknown database error');
        } finally {
            if (client) {
                client.release();
            }
        }
    }

    async findById(id: number, schema: string): Promise<IRole | null> {
        let client;
        try {
            client = await this.database.getClient(schema);
            
            const result = await this.database.query(
                schema,
                'SELECT * FROM roles WHERE id = $1',
                [id]
            );

            return result?.rows?.[0] || null;
        } catch (error) {
            throw error instanceof Error 
                ? error 
                : new Error('Unknown database error');
        } finally {
            if (client) {
                client.release();
            }
        }
    }

    async findByName(name: string, schema: string): Promise<IRole | null> {
        let client;
        try {
            client = await this.database.getClient(schema);
            
            const result = await this.database.query(
                schema,
                'SELECT * FROM roles WHERE name = $1',
                [name]
            );

            return result?.rows?.[0] || null;
        } catch (error) {
            throw error instanceof Error 
                ? error 
                : new Error('Unknown database error');
        } finally {
            if (client) {
                client.release();
            }
        }
    }

    async update(role: IUpdateRoleDto, schema: string): Promise<IRole> {
        let client;
        try {
            client = await this.database.getClient(schema);
            
            const result = await this.database.query(
                schema,
                'UPDATE roles SET name = $1, description = $2 WHERE id = $3 RETURNING *',
                [role.name, role.description, role.id]
            );

            if (!result?.rows?.[0]) {
                throw new Error('Failed to update role');
            }

            return result.rows[0];
        } catch (error) {
            throw error instanceof Error 
                ? error 
                : new Error('Unknown database error');
        } finally {
            if (client) {
                client.release();
            }
        }
    }

    async delete(id: number, schema: string): Promise<void> {
        let client;
        try {
            client = await this.database.getClient(schema);
            
            const result = await this.database.query(
                schema,
                'DELETE FROM roles WHERE id = $1',
                [id]
            );

            if (!result?.rowCount) {
                throw new Error('Failed to delete role');
            }
        } catch (error) {
            throw error instanceof Error 
                ? error 
                : new Error('Unknown database error');
        } finally {
            if (client) {
                client.release();
            }
        }
    }

    async findAll(schema: string): Promise<IRole[]> {
        let client;
        try {
            client = await this.database.getClient(schema);
            
            const result = await this.database.query(
                schema,
                'SELECT * FROM roles ORDER BY id ASC'
            );

            return result?.rows || [];
        } catch (error) {
            throw error instanceof Error 
                ? error 
                : new Error('Unknown database error');
        } finally {
            if (client) {
                client.release();
            }
        }
    }
} 