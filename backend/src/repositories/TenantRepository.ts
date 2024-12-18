import { ITenantCreateDto } from "../models/dtos/tenant/ITenantCreateDto";
import { IUpdateTenantDto } from "../models/dtos/tenant/IUpdateTenantDto";
import { ITenant } from "../models/entities/tenant/ITenant";
import { ITenantOperationLog } from "../models/entities/tenant/ITenantOperationLog";
import { DataBaseResponse } from "../models/responses/DataBaseResponse";
import { BaseRepository } from "./BaseRepository";
import { IDatabase } from "../interfaces/database/IDatabase";

export class TenantRepository extends BaseRepository<ITenant, ITenantCreateDto, IUpdateTenantDto> {
    constructor(database: IDatabase) {
        super(database);
    }

    async create(tenant: ITenantCreateDto, schema: string): Promise<DataBaseResponse<ITenant>> {
        const schemaName = `tenant_${tenant.subdomain}`;
        const result = await this.database.query(
            schema,
            'INSERT INTO tenants (name, subdomain, schema_name) VALUES ($1, $2, $3) RETURNING *',
            [tenant.name, tenant.subdomain, schemaName]
        );

        return {
            isSuccess: (result?.rowCount ?? 0) > 0,
            message: (result?.rowCount ?? 0) > 0 ? 'Tenant created successfully' : 'Failed to create tenant',
            data: result?.rows?.[0] || null
        };
    }

    async findById(id: number, schema: string): Promise<DataBaseResponse<ITenant>> {
        const result = await this.database.query(
            schema,
            'SELECT * FROM tenants WHERE id = $1',
            [id]
        );

        return {
            isSuccess: (result?.rowCount ?? 0) > 0,
            message: (result?.rowCount ?? 0) > 0 ? 'Tenant found' : 'Tenant not found',
            data: result?.rows?.[0] || null
        };
    }

    async findBySubdomain(subdomain: string, schema: string): Promise<DataBaseResponse<ITenant>> {
        const result = await this.database.query(
            schema,
            'SELECT * FROM tenants WHERE subdomain = $1',
            [subdomain]
        );

        return {
            isSuccess: (result?.rowCount ?? 0) > 0,
            message: (result?.rowCount ?? 0) > 0 ? 'Tenant found' : 'Tenant not found',
            data: result?.rows?.[0] || null
        };
    }

    async update(tenant: IUpdateTenantDto, schema: string): Promise<DataBaseResponse<ITenant>> {
        const updates: string[] = [];
        const values: any[] = [];
        let paramCount = 1;

        if (tenant.name) {
            updates.push(`name = $${paramCount}`);
            values.push(tenant.name);
            paramCount++;
        }

        if (tenant.subdomain) {
            updates.push(`subdomain = $${paramCount}`);
            values.push(tenant.subdomain);
            paramCount++;
        }

        if (updates.length === 0) {
            return {
                isSuccess: false,
                message: 'No updates provided',
                data: null
            };
        }

        values.push(tenant.id);
        const query = `
            UPDATE tenants 
            SET ${updates.join(', ')} 
            WHERE id = $${paramCount} 
            RETURNING *
        `;

        const result = await this.database.query(schema, query, values);

        return {
            isSuccess: (result?.rowCount ?? 0) > 0,
            message: (result?.rowCount ?? 0) > 0 ? 'Tenant updated successfully' : 'Failed to update tenant',
            data: result?.rows?.[0] || null
        };
    }

    async delete(id: number, schema: string): Promise<DataBaseResponse<ITenant>> {
        const result = await this.database.query(
            schema,
            'DELETE FROM tenants WHERE id = $1 RETURNING *',
            [id]
        );

        return {
            isSuccess: (result?.rowCount ?? 0) > 0,
            message: (result?.rowCount ?? 0) > 0 ? 'Tenant deleted successfully' : 'Tenant not found',
            data: result?.rows?.[0] || null
        };
    }

    async logOperation(adminId: number, tenantId: number, operationType: string, details: any, schema: string): Promise<DataBaseResponse<ITenantOperationLog>> {
        const result = await this.database.query(
            schema,
            'INSERT INTO tenant_operations_log (admin_id, tenant_id, operation_type, details) VALUES ($1, $2, $3, $4) RETURNING *',
            [adminId, tenantId, operationType, details]
        );

        return {
            isSuccess: (result?.rowCount ?? 0) > 0,
            message: (result?.rowCount ?? 0) > 0 ? 'Operation logged successfully' : 'Failed to log operation',
            data: result?.rows?.[0] || null
        };
    }

    async createWithTransaction(adminId: number, tenantData: ITenantCreateDto, schema: string): Promise<DataBaseResponse<ITenant>> {
        const client = await this.database.getClient(schema);
        if (!client.isSuccess || !client.data) {
            return { isSuccess: false, message: 'Database connection failed', data: null };
        }

        try {
            await client.data.query('BEGIN');

            const result = await this.database.query(
                schema,
                'INSERT INTO tenants (name, subdomain) VALUES ($1, $2) RETURNING *',
                [tenantData.name, tenantData.subdomain]
            );

            if (result.rowCount === 0) {
                return { isSuccess: false, message: 'Failed to create tenant', data: null };
            }

            const logResult = await this.logOperation(
                adminId,
                result.rows[0].id,
                'CREATE_TENANT',
                { subdomain: tenantData.subdomain },
                schema
            );

            if (!logResult.isSuccess) {
                return { isSuccess: false, message: 'Failed to log operation', data: null };
            }

            await client.data.query('COMMIT');

            return {
                isSuccess: true,
                message: 'Tenant created successfully',
                data: result.rows[0]
            };

        } catch (error) {
            await client.data.query('ROLLBACK');
            return {
                isSuccess: false,
                message: error instanceof Error ? error.message : 'Failed to create tenant',
                data: null
            };
        } finally {
            client.data.release();
        }
    }
} 