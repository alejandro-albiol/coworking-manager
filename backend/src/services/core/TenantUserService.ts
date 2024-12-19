import { IDatabase } from "../../interfaces/database/IDatabase";
import { ICreateUserDto } from "../../interfaces/dtos/auth/user/ICreateUserDto";
import { IUser } from "../../models/entities/auth/IUser";
import { DataBaseResponse } from "../../models/responses/DataBaseResponse";
import { TenantRepository } from "../../repositories/TenantRepository";
import { UserRepository } from "../../repositories/UserRepository";
import { SystemAdminService } from "./SystemAdminService";

export class TenantUserService {
    private readonly userRepository: UserRepository;
    private readonly tenantRepository: TenantRepository;
    private readonly systemAdminService: SystemAdminService;

    constructor(private readonly database: IDatabase) {
        this.userRepository = new UserRepository(database);
        this.tenantRepository = new TenantRepository(database);
        this.systemAdminService = new SystemAdminService(database);
    }

    async createUser(adminId: number, tenantId: number, userData: ICreateUserDto): Promise<DataBaseResponse<IUser>> {
        const adminExists = await this.systemAdminService.findActiveAdmin(adminId);
        if (!adminExists.isSuccess) {
            return { isSuccess: false, message: 'Unauthorized operation', data: null };
        }

        const tenant = await this.tenantRepository.findById(tenantId, 'public');
        if (!tenant.isSuccess || !tenant.data) {
            return { isSuccess: false, message: 'Tenant not found', data: null };
        }

        return await this.userRepository.create(userData, tenant.data.schema_name);
    }
}