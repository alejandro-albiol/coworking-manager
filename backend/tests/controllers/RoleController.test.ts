import { RoleController } from '../../src/controllers/RoleController';
import { RoleService } from '../../src/services/domain/RoleService';
import { RoleRepository } from '../../src/repositories/RoleRepository';
import { Request, Response } from 'express';
import { TenantException } from '../../src/exceptions/TenantException';
import { HttpResponse } from '../../src/models/responses/HttpResponse';
import { RoleException } from '../../src/exceptions/RoleException';

describe('RoleController', () => {
    let roleController: RoleController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: jest.Mock;
    let mockRoleRepository: jest.Mocked<RoleRepository>;

    beforeEach(() => {
        mockRoleRepository = {
            create: jest.fn().mockResolvedValue({
                id: 1,
                name: 'TEST_ROLE',
                description: 'Test role description'
            }),
            update: jest.fn().mockResolvedValue({
                id: 1,
                name: 'UPDATED_ROLE',
                description: 'Updated description'
            }),
            findById: jest.fn().mockResolvedValue({
                id: 1,
                name: 'TEST_ROLE',
                description: 'Test role description'
            }),
            findAll: jest.fn().mockResolvedValue([
                {
                    id: 1,
                    name: 'ROLE_1',
                    description: 'Description 1'
                },
                {
                    id: 2,
                    name: 'ROLE_2',
                    description: 'Description 2'
                }
            ]),
            delete: jest.fn().mockResolvedValue(undefined)
        } as any;

        const roleService = new RoleService(mockRoleRepository);
        roleController = new RoleController(roleService);

        mockNext = jest.fn();
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('createRole', () => {
        it('should create a role successfully', async () => {
            const expectedResponse = HttpResponse.created({
                id: 1,
                name: 'TEST_ROLE',
                description: 'Test role description'
            });

            mockRequest = {
                headers: {
                    'x-tenant': 'test-tenant'
                },
                body: {
                    name: 'TEST_ROLE',
                    description: 'Test role description'
                }
            };

            await roleController.createRole(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockResponse.status).toHaveBeenCalledWith(expectedResponse.statusCode);
            expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
        });

        it('should throw TenantException when tenant header is missing', async () => {
            mockRequest = {
                headers: {},
                body: {
                    name: 'TEST_ROLE',
                    description: 'Test role description'
                }
            };

            await roleController.createRole(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toHaveBeenCalledWith(
                expect.any(TenantException)
            );
        });
    });

    describe('updateRole', () => {
        it('should update a role successfully', async () => {
            const expectedResponse = HttpResponse.ok({
                id: 1,
                name: 'UPDATED_ROLE',
                description: 'Updated description'
            });

            mockRequest = {
                headers: { 'x-tenant': 'test-tenant' },
                params: { id: '1' },
                body: {
                    name: 'UPDATED_ROLE',
                    description: 'Updated description'
                }
            };

            await roleController.updateRole(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockRoleRepository.update).toHaveBeenCalledWith(
                expect.objectContaining({
                    id: 1,
                    name: 'UPDATED_ROLE',
                    description: 'Updated description'
                }),
                'test-tenant'
            );

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
        });

        it('should throw TenantException when tenant header is missing', async () => {
            mockRequest = {
                params: { id: '1' },
                headers: {},
                body: {
                    name: 'UPDATED_ROLE',
                    description: 'Updated description'
                }
            };

            await roleController.updateRole(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toHaveBeenCalledWith(
                expect.any(TenantException)
            );
        });
    });

    describe('getRoleById', () => {
        it('should get a role by id successfully', async () => {
            const expectedResponse = HttpResponse.ok({
                id: 1,
                name: 'TEST_ROLE',
                description: 'Test role description'
            });

            mockRequest = {
                headers: { 'x-tenant': 'test-tenant' },
                params: { id: '1' }
            };

            await roleController.getRoleById(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockRoleRepository.findById).toHaveBeenCalledWith(1, 'test-tenant');
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
        });

        it('should throw TenantException when tenant header is missing', async () => {
            mockRequest = {
                params: { id: '1' },
                headers: {}
            };

            await roleController.getRoleById(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toHaveBeenCalledWith(expect.any(TenantException));
        });

        it('should handle role not found', async () => {
            mockRoleRepository.findById.mockResolvedValueOnce(null);

            mockRequest = {
                headers: { 'x-tenant': 'test-tenant' },
                params: { id: '999' }
            };

            await roleController.getRoleById(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toHaveBeenCalledWith(expect.any(RoleException));
        });
    });

    describe('getAllRoles', () => {
        it('should get all roles successfully', async () => {
            const expectedResponse = HttpResponse.ok([
                { id: 1, name: 'ROLE_1', description: 'Description 1' },
                { id: 2, name: 'ROLE_2', description: 'Description 2' }
            ]);

            mockRequest = {
                headers: { 'x-tenant': 'test-tenant' }
            };

            await roleController.getAllRoles(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockRoleRepository.findAll).toHaveBeenCalledWith('test-tenant');
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
        });

        it('should throw TenantException when tenant header is missing', async () => {
            mockRequest = {
                headers: {}
            };

            await roleController.getAllRoles(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toHaveBeenCalledWith(expect.any(TenantException));
        });

        it('should return empty array when no roles exist', async () => {
            mockRoleRepository.findAll.mockResolvedValueOnce([]);
            const expectedResponse = HttpResponse.ok([]);

            mockRequest = {
                headers: { 'x-tenant': 'test-tenant' }
            };

            await roleController.getAllRoles(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
        });
    });

    describe('deleteRole', () => {
        it('should delete a role successfully', async () => {
            const expectedResponse = HttpResponse.noContent();

            mockRequest = {
                headers: { 'x-tenant': 'test-tenant' },
                params: { id: '1' }
            };

            await roleController.deleteRole(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockRoleRepository.delete).toHaveBeenCalledWith(1, 'test-tenant');
            expect(mockResponse.status).toHaveBeenCalledWith(204);
            expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
        });

        it('should throw TenantException when tenant header is missing', async () => {
            mockRequest = {
                params: { id: '1' },
                headers: {}
            };

            await roleController.deleteRole(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toHaveBeenCalledWith(expect.any(TenantException));
        });

        it('should handle deletion of non-existent role', async () => {
            mockRoleRepository.delete.mockRejectedValueOnce(new Error('Role not found'));

            mockRequest = {
                headers: { 'x-tenant': 'test-tenant' },
                params: { id: '999' }
            };

            await roleController.deleteRole(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toHaveBeenCalledWith(expect.any(RoleException));
        });
    });
});