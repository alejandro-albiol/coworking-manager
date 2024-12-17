import { Request } from 'express';

export type TenantRequest = Request & {
  tenantSchema?: string;
};
