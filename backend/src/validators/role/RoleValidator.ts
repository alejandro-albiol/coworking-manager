import { BaseValidator } from '../base/BaseValidator';
import { ValidatorResponse } from '../responses/ValidatorResponse';
import { ROLE_VALIDATION } from '../../constants/roles/roleValidation';
import { IUpdateRoleDto } from '../../interfaces/dtos/auth/role/IUpdateRoleDto';
import { ICreateRoleDto } from '../../interfaces/dtos/auth/role/ICreateRoleDto';
import { SYSTEM_ROLES } from '../../constants/roles/roles';

export class RoleValidator extends BaseValidator {
    static validateCreate(role: ICreateRoleDto): ValidatorResponse<ICreateRoleDto> {
        if (this.isEmpty(role.name)) {
            return ValidatorResponse.invalid('Role name is required');
        }

        if (!this.validateLength(role.name, ROLE_VALIDATION.NAME.MAX_LENGTH)) {
            return ValidatorResponse.invalid('Role name is too long');
        }

        if (!this.validatePattern(role.name, /^[a-zA-Z0-9_\s-]+$/)) {
            return ValidatorResponse.invalid('Role name contains invalid characters');
        }

        return ValidatorResponse.valid(role);
    }

    static validateUpdate(role: IUpdateRoleDto): ValidatorResponse<IUpdateRoleDto> {
        if (role.name && this.isEmpty(role.name)) {
            return ValidatorResponse.invalid('Role name cannot be empty');
        }

        if (role.name && !this.validateLength(role.name, ROLE_VALIDATION.NAME.MAX_LENGTH)) {
            return ValidatorResponse.invalid('Role name is too long');
        }

        if (role.name && !this.validatePattern(role.name, /^[a-zA-Z0-9_\s-]+$/)) {
            return ValidatorResponse.invalid('Role name contains invalid characters');
        }

        if (role.description && !this.validateLength(role.description, ROLE_VALIDATION.DESCRIPTION.MAX_LENGTH)) {
            return ValidatorResponse.invalid('Role description is too long');
        }

        const isSystemRole = Object.values(SYSTEM_ROLES).some(systemRole => 
            systemRole.name === role.name
        );
        if (isSystemRole) {
            return ValidatorResponse.invalid('Cannot modify system roles');
        }

        return ValidatorResponse.valid(role);
    }

    static validateDelete(roleId: number): ValidatorResponse<number> {
        if (!roleId || roleId <= 0) {
            return ValidatorResponse.invalid('Invalid role ID');
        }

        return ValidatorResponse.valid(roleId);
    }

    static validateFindById(id: number): ValidatorResponse<number> {
        if (!id || id <= 0) {
            return ValidatorResponse.invalid('Invalid role ID');
        }

        return ValidatorResponse.valid(id);
    }

    static validateFindByName(name: string): ValidatorResponse<string> {
        if (this.isEmpty(name)) {
            return ValidatorResponse.invalid('Role name is required');
        }

        if (!this.validateLength(name, ROLE_VALIDATION.NAME.MAX_LENGTH)) {
            return ValidatorResponse.invalid('Role name is too long');
        }

        if (!this.validatePattern(name, /^[a-zA-Z0-9_\s-]+$/)) {
            return ValidatorResponse.invalid('Role name contains invalid characters');
        }

        return ValidatorResponse.valid(name);
    }
} 