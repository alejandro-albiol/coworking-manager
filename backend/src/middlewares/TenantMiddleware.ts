import { Response, NextFunction } from 'express';
import { TenantRequest } from '../models/types/TenantRequest';
import { DatabaseService } from '../services/DatabaseService';

export class TenantMiddleware {
    static async handle(req: TenantRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const schema = await TenantMiddleware.getTenantSchema(req);
            if (!schema) {
                res.status(400).json({ error: 'Invalid tenant' });
                return;
            }

            req.tenantSchema = schema;
            next();
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async getTenantSchema(req: TenantRequest): Promise<string | null> {
        try {
            const subdomain = req.headers['x-tenant-id'] || process.env.DEFAULT_SCHEMA;
            if (!subdomain) {
                throw new Error('Invalid tenant');
            }
            const result = await DatabaseService.getTenant(
                'SELECT schema_name FROM public.tenants WHERE subdomain = $1',
                [subdomain]
            );
            if (!result.isSuccess || !result.data) {
                throw new Error('Invalid tenant');
            }
            return result.data.schema_name;
        } catch (error) {
            return null;
        }
    }
}