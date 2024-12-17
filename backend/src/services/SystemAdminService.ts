import { DatabaseService } from './DatabaseService';
import { DataBaseResponse } from '../models/responses/DataBaseResponse';

export class SystemAdminService {
    static async createTenant(adminId: number, tenantData: {
        name: string;
        subdomain: string;
    }): Promise<DataBaseResponse<any>> {
        const client = await DatabaseService.getClient('public');
        if (!client.isSuccess || !client.data) {
            return { isSuccess: false, message: 'Database connection failed', data: null };
        }

        try {
            await client.data.query('BEGIN');

            const adminCheck = await client.data.query(
                'SELECT id FROM system_admins WHERE id = $1 AND active = true',
                [adminId]
            );
            if (adminCheck.rows.length === 0) {
                throw new Error('Unauthorized operation');
            }

            const schemaName = `tenant_${tenantData.subdomain}`;
            const result = await client.data.query(
                'INSERT INTO tenants (name, subdomain, schema_name) VALUES ($1, $2, $3) RETURNING *',
                [tenantData.name, tenantData.subdomain, schemaName]
            );

            await client.data.query(
                'INSERT INTO tenant_operations_log (admin_id, tenant_id, operation_type, details) VALUES ($1, $2, $3, $4)',
                [adminId, result.rows[0].id, 'CREATE_TENANT', { subdomain: tenantData.subdomain }]
            );

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
                message: 'Failed to create tenant', 
                data: null 
            };
        } finally {
            client.data.release();
        }
    }

//TODO: Implementar DeleteTenant y EditTenant

    static async deleteTenantUser(adminId: number, tenantId: number, userId: number): Promise<DataBaseResponse<any>> {
        const client = await DatabaseService.getClient('public');
        if (!client.isSuccess || !client.data) {
            return { isSuccess: false, message: 'Database connection failed', data: null };
        }

        try {
            await client.data.query('BEGIN');

            const adminCheck = await client.data.query(
                'SELECT id FROM system_admins WHERE id = $1 AND active = true',
                [adminId]
            );
            if (adminCheck.rows.length === 0) {
                throw new Error('Unauthorized operation');
            }

            const tenantResult = await client.data.query(
                'SELECT schema_name FROM tenants WHERE id = $1',
                [tenantId]
            );
            if (tenantResult.rows.length === 0) {
                throw new Error('Tenant not found');
            }

            const schemaName = tenantResult.rows[0].schema_name;

            await client.data.query(
                `UPDATE ${schemaName}.users SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1`,
                [userId]
            );

            await client.data.query(
                'INSERT INTO tenant_operations_log (admin_id, tenant_id, operation_type, details) VALUES ($1, $2, $3, $4)',
                [adminId, tenantId, 'DELETE_USER', { userId }]
            );

            await client.data.query('COMMIT');
            return { isSuccess: true, message: 'User deleted successfully', data: null };

        } catch (error) {
            await client.data.query('ROLLBACK');
            return { isSuccess: false, 
                message: 'Failed to delete user', 
                data: null 
            };
        } finally {
            client.data.release();
        }
    }
} 