import { ICreateRoleDto } from "../../models/dtos/auth/role/ICreateRoleDto";
import { IUpdateRoleDto } from "../../models/dtos/auth/role/IUpdateRoleDto";
import { IRole } from "../../models/entities/auth/IRole";
import { DataBaseResponse } from "../../models/responses/DataBaseResponse";
import { DatabaseService } from "../core/DatabaseService";
import { RoleValidator } from "../../validators/role/RoleValidator";
import { SYSTEM_ROLES } from "../../constants/roles/roles";
import { RoleRepository } from "../../repositories/RoleRepository";
import { IFindRoleByIdDto } from "../../models/dtos/auth/role/IFindRoleByIdDto";
import { IFindRoleByNameDto } from "../../models/dtos/auth/role/IFindRoleByNameDto";

export class RoleService {
    static async insertNewRole(role: ICreateRoleDto, schema: string): Promise<DataBaseResponse<IRole>> {
        const validation = RoleValidator.validateCreate(role);
        if (!validation.isValid) {
            return { isSuccess: false, message: validation.message, data: null };
        }

        if (this.isSystemRole(role.name)) {
            return { isSuccess: false, message: 'Role name is reserved', data: null };
        }

        let client;
        try {
            const database = new DatabaseService();
            const roleRepository = new RoleRepository(database);
            const clientResponse = await database.getClient(schema);
            if (!clientResponse.isSuccess || !clientResponse.data) {
                throw new Error('Database connection failed');
            }
            client = clientResponse.data;

            return roleRepository.create(role, schema);
        } catch (error) {
            return { isSuccess: false, message: 'Failed to create role', data: null };
        } finally {
            if (client) {
                client.release();
            }
        }
    }

    static async updateRole(roleToUpdate: IUpdateRoleDto, schema: string): Promise<DataBaseResponse<IRole>> {
        const validation = RoleValidator.validateUpdate(roleToUpdate);
        if (!validation.isValid) {
            return { isSuccess: false, message: validation.message, data: null };
        }

        let client;
        try {
            const database = new DatabaseService();
            const roleRepository = new RoleRepository(database);
            const clientResponse = await database.getClient(schema);
            if (!clientResponse.isSuccess || !clientResponse.data) {
                throw new Error('Database connection failed');
            }
            client = clientResponse.data;

            const role = await this.findRoleById({ id: roleToUpdate.id }, schema);
            if (!role.isSuccess || !role.data) {
                return { isSuccess: false, message: 'Role not found', data: null };
            }

            if (this.isSystemRole(role.data.name)) {
                return { isSuccess: false, message: 'Cannot modify system roles', data: null };
            }

            return roleRepository.update(roleToUpdate, schema);
        } catch (error) {
            return { isSuccess: false, message: 'Failed to update role', data: null };
        } finally {
            if (client) {
                client.release();
            }
        }
    }

    static async deleteRole(roleId: number, schema: string): Promise<DataBaseResponse<IRole>> {
        const validation = RoleValidator.validateDelete(roleId);
        if (!validation.isValid) {
            return { isSuccess: false, message: validation.message, data: null };
        }

        let client;
        try {
            const database = new DatabaseService();
            const roleRepository = new RoleRepository(database);
            const clientResponse = await database.getClient(schema);
            if (!clientResponse.isSuccess || !clientResponse.data) {
                throw new Error('Database connection failed');
            }
            client = clientResponse.data;

            const role = await this.findRoleById({ id: roleId }, schema);
            if (!role.isSuccess || !role.data) {
                return { isSuccess: false, message: 'Role not found', data: null };
            }

            if (this.isSystemRole(role.data.name)) {
                return { isSuccess: false, message: 'Cannot delete system roles', data: null };
            }

            return roleRepository.delete(roleId, schema);
        } catch (error) {
            return { isSuccess: false, message: 'Failed to delete role', data: null };
        } finally {
            if (client) {
                client.release();
            }
        }
    }

    static async findRoleById(roleToFind: IFindRoleByIdDto, schema: string): Promise<DataBaseResponse<IRole>> {
        const database = new DatabaseService();
        const roleRepository = new RoleRepository(database);
        return roleRepository.findById(roleToFind.id, schema);
    }

    static async findRoleByName(roleToFind: IFindRoleByNameDto, schema: string): Promise<DataBaseResponse<IRole>> {
        const database = new DatabaseService();
        const roleRepository = new RoleRepository(database);
        return roleRepository.findByName(roleToFind.name, schema);
    }

    private static isSystemRole(roleName: string): boolean {
        return Object.values(SYSTEM_ROLES).some(systemRole => 
            systemRole.name.toLowerCase() === roleName.toLowerCase()
        );
    }
}