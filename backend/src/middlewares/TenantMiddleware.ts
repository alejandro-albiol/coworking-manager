import { Response, NextFunction } from 'express';
import { TenantRequest } from '../models/types/TenantRequest';
import { DatabaseService } from '../services/DatabaseService';

export class TenantMiddleware {
    static async handle(req: TenantRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const subdomain = req.headers['x-tenant-id'] as string || process.env.DEFAULT_TENANT;
            if (!subdomain) {
                res.status(400).json({ error: 'Tenant ID is required' });
                return;
            }

            const tenantResponse = await DatabaseService.getTenant(subdomain);
            if (!tenantResponse.isSuccess || !tenantResponse.data) {
                res.status(400).json({ error: 'Invalid tenant' });
                return;
            }

            req.tenantSchema = tenantResponse.data.schema_name;
            next();
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}