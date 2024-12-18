import { ICreateSystemAdminDto } from "../models/dtos/auth/systemAdmin/ICreateSystemAdminDto";
import { IUpdateSystemAdminDto } from "../models/dtos/auth/systemAdmin/IUpdateSystemAdminDto";
import { ISystemAdmin } from "../models/entities/auth/ISystemAdmin";
import { DataBaseResponse } from "../models/responses/DataBaseResponse";
import { BaseRepository } from "./BaseRepository";
import { IDatabase } from "../interfaces/database/IDatabase";
export class SystemAdminRepository extends BaseRepository<ISystemAdmin, ICreateSystemAdminDto, IUpdateSystemAdminDto> {
    constructor(database: IDatabase) {
        super(database);
    }

    async create(admin: ICreateSystemAdminDto, schema: string): Promise<DataBaseResponse<ISystemAdmin>> {
        try {
            const result = await this.database.query(
                schema,
                `INSERT INTO system_admins (
                    email, 
                    password_hash, 
                    name, 
                    active
                ) VALUES ($1, $2, $3, true) 
                RETURNING *`,
                [admin.email, admin.password_hash, admin.name]
            );

            if (!result) {
                return {
                    isSuccess: false,
                    message: 'Database query failed',
                    data: null
                };
            }

            if (result.rowCount === 0) {
                return {
                    isSuccess: false,
                    message: 'No rows were affected',
                    data: null
                };
            }

            return {
                isSuccess: true,
                message: 'Admin created successfully',
                data: result.rows[0]
            };

        } catch (error) {
            console.error('SystemAdminRepository.create - Error:', error);
            return {
                isSuccess: false,
                message: error instanceof Error ? error.message : 'Unknown error occurred',
                data: null
            };
        }
    }

    async findById(id: number, schema: string): Promise<DataBaseResponse<ISystemAdmin>> {
        const result = await this.database.query(
            schema,
            'SELECT * FROM system_admins WHERE id = $1',
            [id]
        );

        return {
            isSuccess: (result?.rowCount ?? 0) > 0,
            message: (result?.rowCount ?? 0) > 0 ? 'Admin found' : 'Admin not found',
            data: result?.rows?.[0] || null
        };
    }

    async findActiveAdmin(adminId: number, schema: string): Promise<DataBaseResponse<ISystemAdmin>> {
        try {
            const result = await this.database.query(
                schema,
                'SELECT * FROM system_admins WHERE id = $1 AND active = true',
                [adminId]
            );

            if (!result || result.rowCount === 0) {
                return {
                    isSuccess: false,
                    message: 'Admin not found',
                    data: null
                };
            }

            return {
                isSuccess: true,
                message: 'Admin found',
                data: result.rows[0]
            };
        } catch (error) {
            return {
                isSuccess: false,
                message: error instanceof Error ? error.message : 'Failed to find admin',
                data: null
            };
        }
    }

    async update(admin: IUpdateSystemAdminDto, schema: string): Promise<DataBaseResponse<ISystemAdmin>> {
        const updates: string[] = [];
        const values: any[] = [];
        let paramCount = 1;

        if (admin.email) {
            updates.push(`email = $${paramCount}`);
            values.push(admin.email);
            paramCount++;
        }

        if (admin.password_hash) {
            updates.push(`password_hash = $${paramCount}`);
            values.push(admin.password_hash);
            paramCount++;
        }

        if (admin.name) {
            updates.push(`name = $${paramCount}`);
            values.push(admin.name);
            paramCount++;
        }

        if (typeof admin.active === 'boolean') {
            updates.push(`active = $${paramCount}`);
            values.push(admin.active);
            paramCount++;
        }

        if (updates.length === 0) {
            return {
                isSuccess: false,
                message: 'No updates provided',
                data: null
            };
        }

        values.push(admin.id);
        const query = `
            UPDATE system_admins 
            SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP 
            WHERE id = $${paramCount} 
            RETURNING *
        `;

        const result = await this.database.query(schema, query, values);

        return {
            isSuccess: (result?.rowCount ?? 0) > 0,
            message: (result?.rowCount ?? 0) > 0 ? 'Admin updated successfully' : 'Failed to update admin',
            data: result?.rows?.[0] || null
        };
    }

    async delete(id: number, schema: string): Promise<DataBaseResponse<ISystemAdmin>> {
        const result = await this.database.query(
            schema,
            'UPDATE system_admins SET active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
            [id]
        );

        return {
            isSuccess: (result?.rowCount ?? 0) > 0,
            message: (result?.rowCount ?? 0) > 0 ? 'Admin deleted successfully' : 'Admin not found',
            data: result?.rows?.[0] || null
        };
    }
}   