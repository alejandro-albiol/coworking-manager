import { IFindRoleByIdDto } from "../../models/dtos/auth/role/IFindRoleByIdDto";
import { IFindRoleByNameDto } from "../../models/dtos/auth/role/IFindRoleByNameDto";
import { IUpdateRoleDto } from "../../models/dtos/auth/role/IUpdateRoleDto";
import { IRole } from "../../models/entities/auth/IRole";
import { DataBaseResponse } from "../../models/responses/DataBaseResponse";

export interface IRoleService {
    updateRole(roleToUpdate: IUpdateRoleDto, schema: string): Promise<DataBaseResponse<IRole>>;
    findRoleById(roleToFind: IFindRoleByIdDto, schema: string): Promise<DataBaseResponse<IRole>>;
    findRoleByName(roleToFind: IFindRoleByNameDto, schema: string): Promise<DataBaseResponse<IRole>>;
    insertNewRole(newRole: IRole, schema: string): Promise<DataBaseResponse<IRole>>;
    deleteRole(roleId: number, schema: string): Promise<DataBaseResponse<IRole>>;
} 