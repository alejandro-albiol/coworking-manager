import { ICreateUserDto } from "../dtos/auth/user/ICreateUserDto";
import { IUser } from "../../models/entities/auth/IUser";
import { DataBaseResponse } from "../../models/responses/DataBaseResponse";

export interface ITenantUserService {
    createUser(adminId: number, tenantId: number, userData: ICreateUserDto): Promise<DataBaseResponse<IUser>>;
    editUser(adminId: number, tenantId: number, userId: number, userData: IUser): Promise<DataBaseResponse<IUser>>;
    deleteUser(adminId: number, tenantId: number, userId: number): Promise<DataBaseResponse<void>>;
    findUser(adminId: number, tenantId: number, userId: number): Promise<DataBaseResponse<IUser>>;
} 