import { DatabaseService } from "../../src/services/core/DatabaseService";
import { SystemAdminService } from "../../src/services/core/SystemAdminService";
import { ICreateSystemAdminDto } from "../../src/models/dtos/auth/systemAdmin/ICreateSystemAdminDto";
import { ICreateSystemAdminInputDto } from "../../src/models/dtos/auth/systemAdmin/ICreateSystemAdminInputDto";
import { ISystemAdmin } from "../../src/models/entities/auth/ISystemAdmin";

describe('SystemAdminService', () => {
    let systemAdminService: SystemAdminService;
    let database: DatabaseService;
    let testAdmin: ISystemAdmin;

    beforeAll(() => {
        database = new DatabaseService();
        systemAdminService = new SystemAdminService(database);
    });

    describe('Admin CRUD Operations', () => {
        it('should create a system admin', async () => {
            const adminData: ICreateSystemAdminInputDto = {
                email: `test.admin.${Date.now()}@test.com`,
                password: 'test_password',
                name: 'Test Admin'
            };

            const result = await systemAdminService.createAdmin(adminData);
            
            expect(result.isSuccess).toBe(true);
            expect(result.data).toBeDefined();
            expect(result.data?.email).toBe(adminData.email);
            expect(result.data?.name).toBe(adminData.name);
            
            testAdmin = result.data!;
        });

        it('should find an active admin', async () => {
            const result = await systemAdminService.findActiveAdmin(testAdmin.id);
            
            expect(result.isSuccess).toBe(true);
            expect(result.data).toBeDefined();
            expect(result.data?.id).toBe(testAdmin.id);
        });

        it('should delete an admin', async () => {
            const result = await systemAdminService.deleteAdmin(testAdmin.id);
            
            expect(result.isSuccess).toBe(true);
            expect(result.data).toBeDefined();
            expect(result.data?.id).toBe(testAdmin.id);
        });
    });

    describe('Error cases', () => {
        it('should fail to find a deleted admin', async () => {
            const result = await systemAdminService.findActiveAdmin(testAdmin.id);
            
            expect(result.isSuccess).toBe(false);
            expect(result.data).toBeNull();
            expect(result.message).toBeDefined();
        });
    });
});

