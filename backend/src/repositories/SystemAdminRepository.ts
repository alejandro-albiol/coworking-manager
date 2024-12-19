import { ICreateSystemAdminDto } from "../interfaces/dtos/auth/systemAdmin/ICreateSystemAdminDto";
import { IUpdateSystemAdminDto } from "../interfaces/dtos/auth/systemAdmin/IUpdateSystemAdminDto";
import { ISystemAdmin } from "../models/entities/auth/ISystemAdmin";
import { Database } from "../database/Database";
import { BaseRepository } from "./base/BaseRepository";

export class SystemAdminRepository extends BaseRepository<ISystemAdmin, ICreateSystemAdminDto, IUpdateSystemAdminDto> {
    findAll(schema: string): Promise<ISystemAdmin[]> {
        throw new Error("Method not implemented.");
    }
    constructor(database: Database) {
        super(database);
    }

    async create(admin: ICreateSystemAdminDto, schema: string): Promise<ISystemAdmin> {
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
                throw new Error('Failed to create admin');
            }

            if (result.rowCount === 0) {
                throw new Error('No rows were affected');
            }

            return result.rows[0];

        } catch (error) {
            throw error instanceof Error ? error : new Error('Unknown database error');
        }
    }

    async findById(id: number, schema: string): Promise<ISystemAdmin | null> {
        const result = await this.database.query(
            schema,
            'SELECT * FROM system_admins WHERE id = $1',
            [id]
        );

        return result?.rows?.[0] || null;
    }

    async findActiveAdmin(adminId: number, schema: string): Promise<ISystemAdmin | null> {
        const result = await this.database.query(
            schema,
            'SELECT * FROM system_admins WHERE id = $1 AND active = true',
            [adminId]
        );

        return result?.rows?.[0] || null;
    }

    async update(admin: IUpdateSystemAdminDto, schema: string): Promise<ISystemAdmin> {
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
            throw new Error('No updates provided');
        }

        values.push(admin.id);
        const query = `
            UPDATE system_admins 
            SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP 
            WHERE id = $${paramCount} 
            RETURNING *
        `;

        const result = await this.database.query(schema, query, values);

        return result?.rows?.[0] || null;
    }

    async delete(id: number, schema: string): Promise<void> {
        const result = await this.database.query(
            schema,
            'UPDATE system_admins SET active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
            [id]
        );

        return result?.rows?.[0] || null;
    }
}   