import { RoleRepository } from "../../repositories/RoleRepository";
import { RoleValidator } from "../../validators/role/RoleValidator";
import { RoleException } from "../../exceptions/RoleException";
import { HttpResponse } from "../../models/responses/HttpResponse";
import { IRoleDto } from "../../interfaces/dtos/auth/role/IRoleDto";
import { IRoleInputDto } from "../../interfaces/dtos/auth/role/IRoleInputDto";
import { ICreateRoleDto } from "../../interfaces/dtos/auth/role/ICreateRoleDto";
import { IUpdateRoleDto } from "../../interfaces/dtos/auth/role/IUpdateRoleDto";

export class RoleService {
    constructor(private readonly roleRepository: RoleRepository) {}

    async createRole(roleInput: IRoleInputDto, tenant: string): Promise<HttpResponse<IRoleDto>> {
        const validationResult = RoleValidator.validateCreate(roleInput);
        if (!validationResult.isValid) {
            throw new RoleException(validationResult.message);
        }

        try {
            const createRoleDto: ICreateRoleDto = {
                name: roleInput.name,
                description: roleInput.description
            };

            const role = await this.roleRepository.create(createRoleDto, tenant);
            return HttpResponse.created<IRoleDto>(role);
        } catch (error) {
            throw new RoleException('Failed to create role');
        }
    }

    async updateRole(id: number, roleInput: IRoleInputDto, tenant: string): Promise<HttpResponse<IRoleDto>> {
        const validationResult = RoleValidator.validateUpdate({ id, ...roleInput });
        if (!validationResult.isValid) {
            throw new RoleException(validationResult.message);
        }

        try {
            const updateRoleDto: IUpdateRoleDto = {
                id,
                name: roleInput.name,
                description: roleInput.description
            };

            const role = await this.roleRepository.update(updateRoleDto, tenant);
            return HttpResponse.ok<IRoleDto>(role);
        } catch (error) {
            throw new RoleException('Failed to update role');
        }
    }

    async findRoleById(id: number, tenant: string): Promise<HttpResponse<IRoleDto>> {
        const validationResult = RoleValidator.validateFindById(id);
        if (!validationResult.isValid) {
            throw new RoleException(validationResult.message);
        }

        try {
            const role = await this.roleRepository.findById(id, tenant);
            if (!role) {
                throw new RoleException('Role not found');
            }
            return HttpResponse.ok<IRoleDto>(role);
        } catch (error) {
            throw error instanceof RoleException 
                ? error 
                : new RoleException('Failed to find role');
        }
    }

    async findAllRoles(tenant: string): Promise<HttpResponse<IRoleDto[]>> {
        try {
            const roles = await this.roleRepository.findAll(tenant);
            return HttpResponse.ok<IRoleDto[]>(roles);
        } catch (error) {
            throw new RoleException('Failed to fetch roles');
        }
    }

    async deleteRole(id: number, tenant: string): Promise<HttpResponse<void>> {
        const validationResult = RoleValidator.validateDelete(id);
        if (!validationResult.isValid) {
            throw new RoleException(validationResult.message);
        }

        try {
            await this.roleRepository.delete(id, tenant);
            return HttpResponse.noContent();
        } catch (error) {
            throw new RoleException('Failed to delete role');
        }
    }
}