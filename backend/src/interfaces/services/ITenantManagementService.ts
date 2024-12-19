import { ITenantCreateDto } from "../dtos/tenant/ITenantCreateDto";
import { ITenant } from "../../models/entities/tenant/ITenant";
import { DataBaseResponse } from "../../models/responses/DataBaseResponse";

export interface ITenantManagementService {
    createTenant(adminId: number, tenantData: ITenantCreateDto): Promise<DataBaseResponse<ITenant>>;
    editTenant(adminId: number, tenantId: number, tenantData: ITenant): Promise<DataBaseResponse<ITenant>>;
    deleteTenant(adminId: number, tenantId: number): Promise<DataBaseResponse<void>>;
} 