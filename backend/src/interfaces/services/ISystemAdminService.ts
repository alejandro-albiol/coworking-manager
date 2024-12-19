import { ICreateSystemAdminInputDto } from "../dtos/auth/systemAdmin/ICreateSystemAdminInputDto";
import { ISystemAdmin } from "../../models/entities/auth/ISystemAdmin";
import { DataBaseResponse } from "../../models/responses/DataBaseResponse";

export interface ISystemAdminService {
    createAdmin(adminInput: ICreateSystemAdminInputDto): Promise<DataBaseResponse<ISystemAdmin>>;
    findActiveAdmin(adminId: number): Promise<DataBaseResponse<ISystemAdmin>>;
    deleteAdmin(adminId: number): Promise<DataBaseResponse<ISystemAdmin>>;
}
