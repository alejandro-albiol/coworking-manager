import { ICreateUserDto } from "../interfaces/dtos/auth/user/ICreateUserDto";
import { IUpdateUserDto } from "../interfaces/dtos/auth/user/IUpdateUserDto";
import { IUser } from "../models/entities/auth/IUser";
import { DataBaseResponse } from "../models/responses/DataBaseResponse";
import { BaseRepository } from "./BaseRepository";
import { IDatabase } from "../interfaces/database/IDatabase";

export class UserRepository extends BaseRepository<IUser, ICreateUserDto, IUpdateUserDto> {
    constructor(database: IDatabase) {
        super(database);
    }

    async create(user: ICreateUserDto, schema: string): Promise<DataBaseResponse<IUser>> {
        const result = await this.database.query(
            schema,
            `INSERT INTO users (
                email, 
                password_hash, 
                first_name, 
                last_name, 
                role_id, 
                active
            ) VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING *`,
            [
                user.email, 
                user.password_hash,
                user.first_name, 
                user.last_name, 
                user.role_id, 
                true
            ]
        );

        return {
            isSuccess: (result?.rowCount ?? 0) > 0,
            message: (result?.rowCount ?? 0) > 0 ? 'User created successfully' : 'Failed to create user',
            data: result?.rows?.[0] || null
        };
    }

    async findById(id: number, schema: string): Promise<DataBaseResponse<IUser>> {
        const result = await this.database.query(
            schema,
            'SELECT * FROM users WHERE id = $1 AND deleted_at IS NULL',
            [id]
        );

        return {
            isSuccess: (result?.rowCount ?? 0) > 0,
            message: (result?.rowCount ?? 0) > 0 ? 'User found' : 'User not found',
            data: result?.rows?.[0] || null
        };
    }

    async findByEmail(email: string, schema: string): Promise<DataBaseResponse<IUser>> {
        const result = await this.database.query(
            schema,
            'SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL',
            [email]
        );

        return {
            isSuccess: (result?.rowCount ?? 0) > 0,
            message: (result?.rowCount ?? 0) > 0 ? 'User found' : 'User not found',
            data: result?.rows?.[0] || null
        };
    }

    async update(user: IUpdateUserDto, schema: string): Promise<DataBaseResponse<IUser>> {
        const result = await this.database.query(
            schema,
            `UPDATE users 
             SET email = $1, 
                 first_name = $2, 
                 last_name = $3, 
                 role_id = $4,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $5 
             AND deleted_at IS NULL 
             RETURNING *`,
            [
                user.email, 
                user.first_name, 
                user.last_name, 
                user.role_id, 
                user.id
            ]
        );

        return {
            isSuccess: (result?.rowCount ?? 0) > 0,
            message: (result?.rowCount ?? 0) > 0 ? 'User updated successfully' : 'Failed to update user',
            data: result?.rows?.[0] || null
        };
    }

    async delete(id: number, schema: string): Promise<DataBaseResponse<IUser>> {
        const result = await this.database.query(
            schema,
            `UPDATE users 
             SET deleted_at = CURRENT_TIMESTAMP,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $1 
             AND deleted_at IS NULL 
             RETURNING *`,
            [id]
        );

        return {
            isSuccess: (result?.rowCount ?? 0) > 0,
            message: (result?.rowCount ?? 0) > 0 ? 'User deleted successfully' : 'Failed to delete user',
            data: result?.rows?.[0] || null
        };
    }

    async updatePassword(id: number, passwordHash: string, schema: string): Promise<DataBaseResponse<IUser>> {
        const result = await this.database.query(
            schema,
            `UPDATE users 
             SET password_hash = $1,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $2 
             AND deleted_at IS NULL 
             RETURNING *`,
            [passwordHash, id]
        );

        return {
            isSuccess: (result?.rowCount ?? 0) > 0,
            message: (result?.rowCount ?? 0) > 0 ? 'Password updated successfully' : 'Failed to update password',
            data: result?.rows?.[0] || null
        };
    }
}