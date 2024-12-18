import { BaseValidator } from '../common/BaseValidator';
import { ROLE_VALIDATION } from '../../constants/roles/roleValidation';
import { IUpdateRoleDto } from '../../models/dtos/auth/role/IUpdateRoleDto';
import { ValidatorResponse } from '../../models/responses/ValidatorResponse';
import { SYSTEM_ROLES } from '../../constants/roles/roles';
import { ICreateRoleDto } from '../../models/dtos/auth/role/ICreateRoleDto';

export class RoleValidator extends BaseValidator {
    static validateUpdate(role: IUpdateRoleDto): ValidatorResponse {
        if (role.name && this.isEmpty(role.name)) {
            return { isValid: false, message: 'Role name cannot be empty' };
        }

        if (role.name && !this.validateLength(role.name, ROLE_VALIDATION.NAME.MAX_LENGTH)) {
            return { isValid: false, message: 'Role name is too long' };
        }

        if (role.name && !this.validatePattern(role.name, /^[a-zA-Z0-9_\s-]+$/)) {
            return { isValid: false, message: 'Role name contains invalid characters' };
        }

        if (role.description && !this.validateLength(role.description, ROLE_VALIDATION.DESCRIPTION.MAX_LENGTH)) {
            return { isValid: false, message: 'Role description is too long' };
        }

        const isSystemRole = Object.values(SYSTEM_ROLES).some(systemRole => 
            systemRole.name === role.name
        );
        if (isSystemRole) {
            return { 
                isValid: false, 
                message: 'Cannot modify system roles' 
            };
        }

        return { isValid: true, message: 'Validation successful' };
    }

    static validateCreate(role: ICreateRoleDto): ValidatorResponse {
        if (this.isEmpty(role.name)) {
            return { isValid: false, message: 'Role name is required' };
        }

        if (!this.validateLength(role.name, ROLE_VALIDATION.NAME.MAX_LENGTH)) {
            return { isValid: false, message: 'Role name is too long' };
        }

        if (!this.validatePattern(role.name, /^[a-zA-Z0-9_\s-]+$/)) {
            return { isValid: false, message: 'Role name contains invalid characters' };
        }

        return { isValid: true, message: 'Validation successful' };
    }

    static validateDelete(roleId: number): ValidatorResponse {
        if (!roleId || roleId <= 0) {
            return { isValid: false, message: 'Invalid role ID' };
        }

        return { isValid: true, message: 'Validation successful' };
    }

    static validateFindById(id: number): ValidatorResponse {
        if (!id || id <= 0) {
            return { isValid: false, message: 'Invalid role ID' };
        }

        return { isValid: true, message: 'Validation successful' };
    }

    static validateFindByName(name: string): ValidatorResponse {
        if (this.isEmpty(name)) {
            return { isValid: false, message: 'Role name is required' };
        }

        if (!this.validateLength(name, ROLE_VALIDATION.NAME.MAX_LENGTH)) {
            return { isValid: false, message: 'Role name is too long' };
        }

        if (!this.validatePattern(name, /^[a-zA-Z0-9_\s-]+$/)) {
            return { isValid: false, message: 'Role name contains invalid characters' };
        }

        return { isValid: true, message: 'Validation successful' };
    }
} 