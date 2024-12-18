import { Response, NextFunction } from 'express';
import { TenantMiddleware } from '../../src/middlewares/TenantMiddleware';
import { TenantRequest } from '../../src/types/TenantRequest';

describe('TenantMiddleware', () => {
    let mockRequest: Partial<TenantRequest>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction;

    const existingTenant = {
        subdomain: 'demo',
        schema_name: 'tenant_1'
    };

    beforeEach(() => {
        mockRequest = {
            headers: {}
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        nextFunction = jest.fn();
    });

    test('should set tenant schema when valid tenant ID is provided', async () => {
        mockRequest.headers = { 'x-tenant-id': existingTenant.subdomain };
        
        await TenantMiddleware.handle(
            mockRequest as TenantRequest,
            mockResponse as Response,
            nextFunction
        );

        expect(mockRequest.tenantSchema).toBe(existingTenant.schema_name);
        expect(nextFunction).toHaveBeenCalled();
    });

    test('should return 400 when no tenant ID is provided', async () => {
        await TenantMiddleware.handle(
            mockRequest as TenantRequest,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Tenant ID is required' });
    });

    test('should return 400 when invalid tenant ID is provided', async () => {
        mockRequest.headers = { 'x-tenant-id': 'invalid_tenant' };
        
        await TenantMiddleware.handle(
            mockRequest as TenantRequest,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid tenant' });
    });
}); 