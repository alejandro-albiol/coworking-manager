import { Request, Response, NextFunction } from 'express';
import { RoleService } from '../services/domain/RoleService';
import { IRoleInputDto } from '../interfaces/dtos/auth/role/IRoleInputDto';
import { TenantException } from '../exceptions/TenantException';

export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    async createRole(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const tenant = req.headers['x-tenant'] as string;
            if (!tenant) {
                throw TenantException.invalidData('Tenant header is required');
            }

            const response = await this.roleService.createRole(req.body as IRoleInputDto, tenant);
            res.status(response.statusCode).json(response);
        } catch (error) {
            next(error);
        }
    }

    async updateRole(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const tenant = req.headers['x-tenant'] as string;
            if (!tenant) {
                throw TenantException.invalidData('Tenant header is required');
            }

            const id = Number(req.params.id);
            const response = await this.roleService.updateRole(id, req.body as IRoleInputDto, tenant);
            res.status(response.statusCode).json(response);
        } catch (error) {
            next(error);
        }
    }

    async getRoleById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const tenant = req.headers['x-tenant'] as string;
            if (!tenant) {
                throw TenantException.invalidData('Tenant header is required');
            }

            const id = Number(req.params.id);
            const response = await this.roleService.findRoleById(id, tenant);
            res.status(response.statusCode).json(response);
        } catch (error) {
            next(error);
        }
    }

    async getAllRoles(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const tenant = req.headers['x-tenant'] as string;
            if (!tenant) {
                throw TenantException.invalidData('Tenant header is required');
            }

            const response = await this.roleService.findAllRoles(tenant);
            res.status(response.statusCode).json(response);
        } catch (error) {
            next(error);
        }
    }

    async deleteRole(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const tenant = req.headers['x-tenant'] as string;
            if (!tenant) {
                throw TenantException.invalidData('Tenant header is required');
            }

            const id = Number(req.params.id);
            const response = await this.roleService.deleteRole(id, tenant);
            res.status(response.statusCode).json(response);
        } catch (error) {
            next(error);
        }
    }
}
