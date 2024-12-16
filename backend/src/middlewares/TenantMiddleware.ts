import { Response, NextFunction } from 'express';
import { Pool } from 'pg';
import { TenantRequest } from '../types/TenantRequest';

export class TenantMiddleware {
  private readonly pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  public async handle(req: TenantRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const schema = await this.getTenantSchema(req);
      if (schema) {
        req.tenantSchema = schema;
        next();
      } else {
        res.status(400).json({ error: 'Invalid tenant' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  private async getTenantSchema(req: TenantRequest): Promise<string | null> {
    const subdomain = req.headers['x-tenant-id'] || process.env.DEFAULT_SCHEMA;
    const result = await this.pool.query(
      'SELECT schema_name FROM public.tenants WHERE subdomain = $1',
      [subdomain]
    );
    return result.rows.length > 0 ? result.rows[0].schema_name : null;
  }
}