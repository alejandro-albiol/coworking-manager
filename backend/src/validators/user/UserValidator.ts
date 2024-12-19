import { BaseValidator } from "../common/BaseValidator";
import { IUserInputDto } from "../../interfaces/dtos/auth/user/IUserInputDto";
import { IUpdateUserDto } from "../../interfaces/dtos/auth/user/IUpdateUserDto";
import { ValidatorResponse } from "../../models/responses/ValidatorResponse";
import { IUserToAuthenticateDto } from "../../interfaces/dtos/auth/user/IUserToAuthenticateDto";

export class UserValidator extends BaseValidator {
    static validateCreate(user: IUserInputDto): ValidatorResponse {
        if (!user.email || !this.isValidEmail(user.email)) {
            return { isValid: false, message: 'Invalid email format' };
        }

        if (!user.password || !this.isValidPassword(user.password)) {
            return { isValid: false, message: 'Password must be at least 8 characters long and contain at least one number' };
        }

        if (!user.first_name || user.first_name.length < 2) {
            return { isValid: false, message: 'First name must be at least 2 characters long' };
        }

        if (!user.last_name || user.last_name.length < 2) {
            return { isValid: false, message: 'Last name must be at least 2 characters long' };
        }

        if (!user.role_id || !Number.isInteger(user.role_id) || user.role_id < 1) {
            return { isValid: false, message: 'Invalid role ID' };
        }

        return { isValid: true, message: 'Validation successful' };
    }

    static validateUpdate(user: IUpdateUserDto): ValidatorResponse {
        if (!user.email && !user.password && !user.first_name && !user.last_name && !user.role_id && user.active === undefined) {
            return { isValid: false, message: 'At least one field must be provided for update' };
        }

        if (user.email && !this.isValidEmail(user.email)) {
            return { isValid: false, message: 'Invalid email format' };
        }

        if (user.password && !this.isValidPassword(user.password)) {
            return { isValid: false, message: 'Password must be at least 8 characters long and contain at least one number' };
        }

        if (user.first_name && user.first_name.length < 2) {
            return { isValid: false, message: 'First name must be at least 2 characters long' };
        }

        if (user.last_name && user.last_name.length < 2) {
            return { isValid: false, message: 'Last name must be at least 2 characters long' };
        }

        if (user.role_id && (!Number.isInteger(user.role_id) || user.role_id < 1)) {
            return { isValid: false, message: 'Invalid role ID' };
        }

        return { isValid: true, message: 'Validation successful' };
    }

    static validateFindByEmail(email: string): ValidatorResponse {
        if (!email) {
            return { isValid: false, message: 'Email is required' };
        }

        if (!this.isValidEmail(email)) {
            return { isValid: false, message: 'Invalid email format' };
        }

        return { isValid: true, message: 'Validation successful' };
    }

    static validateFindById(id: number): ValidatorResponse {
        if (!id || id <= 0) {
            return { isValid: false, message: 'Invalid user ID' };
        }

        return { isValid: true, message: 'Validation successful' };
    }

    static validateAuthenticate(userToAuthenticate: IUserToAuthenticateDto): ValidatorResponse {
        if (!userToAuthenticate.email || !this.isValidEmail(userToAuthenticate.email)) {
            return { isValid: false, message: 'Invalid email format' };
        }

        if (!userToAuthenticate.password || !this.isValidPassword(userToAuthenticate.password)) {
            return { isValid: false, message: 'Invalid password format' };
        }

        return { isValid: true, message: 'Validation successful' };
    }

    private static isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    private static isValidPassword(password: string): boolean {
        return password.length >= 8 && /\d/.test(password);
    }
}