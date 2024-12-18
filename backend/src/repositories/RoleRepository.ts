import { ICreateRoleDto } from "../models/dtos/auth/role/ICreateRoleDto";
import { IUpdateRoleDto } from "../models/dtos/auth/role/IUpdateRoleDto";
import { IRole } from "../models/entities/auth/IRole";
import { DataBaseResponse } from "../models/responses/DataBaseResponse";
import { BaseRepository } from "./BaseRepository";
import { IDatabase } from "../interfaces/database/IDatabase";

export class RoleRepository extends BaseRepository<IRole, ICreateRoleDto, IUpdateRoleDto> {
    constructor(database: IDatabase) {
        super(database);
    }

    async create(role: ICreateRoleDto, schema: string): Promise<DataBaseResponse<IRole>> {
        const result = await this.database.query(
            schema,
            'INSERT INTO roles (name, description) VALUES ($1, $2) RETURNING *',
            [role.name, role.description]
        );

        return {
            isSuccess: (result?.rowCount ?? 0) > 0,
            message: (result?.rowCount ?? 0) > 0 ? 'Role created successfully' : 'Failed to create role',
            data: result?.rows?.[0] || null
        };
    }

    async findById(id: number, schema: string): Promise<DataBaseResponse<IRole>> {
        const result = await this.database.query(
            schema,
            'SELECT * FROM roles WHERE id = $1',
            [id]
        );

        return {
            isSuccess: (result?.rowCount ?? 0) > 0,
            message: (result?.rowCount ?? 0) > 0 ? 'Role found' : 'Role not found',
            data: result?.rows?.[0] || null
        };
    }

    async findByName(name: string, schema: string): Promise<DataBaseResponse<IRole>> {
        const result = await this.database.query(
            schema,
            'SELECT * FROM roles WHERE name = $1',
            [name]
        );

        return {
            isSuccess: (result?.rowCount ?? 0) > 0,
            message: (result?.rowCount ?? 0) > 0 ? 'Role found' : 'Role not found',
            data: result?.rows?.[0] || null
        };
    }

    async update(role: IUpdateRoleDto, schema: string): Promise<DataBaseResponse<IRole>> {
        const result = await this.database.query(
            schema,
            'UPDATE roles SET name = $1, description = $2 WHERE id = $3 RETURNING *',
            [role.name, role.description, role.id]
        );

        return {
            isSuccess: (result?.rowCount ?? 0) > 0,
            message: (result?.rowCount ?? 0) > 0 ? 'Role updated successfully' : 'Failed to update role',
            data: result?.rows?.[0] || null
        };
    }

    async delete(id: number, schema: string): Promise<DataBaseResponse<IRole>> {
        const result = await this.database.query(
            schema,
            'DELETE FROM roles WHERE id = $1 RETURNING *',
            [id]
        );

        return {
            isSuccess: (result?.rowCount ?? 0) > 0,
            message: (result?.rowCount ?? 0) > 0 ? 'Role deleted successfully' : 'Role not found',
                data: result?.rows?.[0] || null
        };
    }
} 