import { IDatabase } from "../../interfaces/database/IDatabase";

import { ITenantCreateDto } from "../../interfaces/dtos/tenant/ITenantCreateDto";
import { ITenant } from "../../models/entities/tenant/ITenant";
import { DataBaseResponse } from "../../models/responses/DataBaseResponse";
import { TenantRepository } from "../../repositories/TenantRepository";
import { SystemAdminService } from "./SystemAdminService";

export class TenantManagementService {
    private readonly tenantRepository: TenantRepository;
    private readonly systemAdminService: SystemAdminService;

    constructor(private readonly database: IDatabase) {
        this.tenantRepository = new TenantRepository(database);
        this.systemAdminService = new SystemAdminService(database);
    }

    async createTenant(adminId: number, tenantData: ITenantCreateDto): Promise<DataBaseResponse<ITenant>> {
        const adminExists = await this.systemAdminService.findActiveAdmin(adminId);
        if (!adminExists.isSuccess) {
            return { isSuccess: false, message: 'Unauthorized operation', data: null };
        }

        return await this.tenantRepository.create(tenantData, 'public');
    }

    async editTenant(adminId: number, tenantId: number, tenantData: ITenant): Promise<DataBaseResponse<ITenant>> {
        const adminExists = await this.systemAdminService.findActiveAdmin(adminId);
        if (!adminExists.isSuccess) {
            return { isSuccess: false, message: 'Unauthorized operation', data: null };
        }

        return await this.tenantRepository.update({ ...tenantData, id: tenantId }, 'public');
    }

    async deleteTenant(adminId: number, tenantId: number): Promise<DataBaseResponse<ITenant>> {
        const adminExists = await this.systemAdminService.findActiveAdmin(adminId);
        if (!adminExists.isSuccess) {
            return { isSuccess: false, message: 'Unauthorized operation', data: null };
        }

        return await this.tenantRepository.delete(tenantId, 'public');
    }
} 