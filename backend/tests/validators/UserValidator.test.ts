import { UserValidator } from '../../src/validators/user/UserValidator';
import { IUserInputDto } from '../../src/models/dtos/auth/user/IUserInputDto';
import { IUpdateUserDto } from '../../src/models/dtos/auth/user/IUpdateUserDto';

describe('UserValidator', () => {
    describe('validateCreate', () => {
        const validUser: IUserInputDto = {
            email: 'test@example.com',
            password: 'Password123',
            first_name: 'John',
            last_name: 'Doe',
            role_id: 1
        };

        it('should validate a correct user', () => {
            const result = UserValidator.validateCreate(validUser);
            expect(result.isValid).toBe(true);
        });

        it('should fail with invalid email', () => {
            const invalidUser = { ...validUser, email: 'invalid-email' };
            const result = UserValidator.validateCreate(invalidUser);
            expect(result.isValid).toBe(false);
            expect(result.message).toBe('Invalid email format');
        });

        it('should fail with short password', () => {
            const invalidUser = { ...validUser, password: 'short1' };
            const result = UserValidator.validateCreate(invalidUser);
            expect(result.isValid).toBe(false);
            expect(result.message).toBe('Password must be at least 8 characters long and contain at least one number');
        });

        it('should fail with password without numbers', () => {
            const invalidUser = { ...validUser, password: 'PasswordWithoutNumbers' };
            const result = UserValidator.validateCreate(invalidUser);
            expect(result.isValid).toBe(false);
            expect(result.message).toBe('Password must be at least 8 characters long and contain at least one number');
        });

        it('should fail with short first name', () => {
            const invalidUser = { ...validUser, first_name: 'J' };
            const result = UserValidator.validateCreate(invalidUser);
            expect(result.isValid).toBe(false);
            expect(result.message).toBe('First name must be at least 2 characters long');
        });

        it('should fail with short last name', () => {
            const invalidUser = { ...validUser, last_name: 'D' };
            const result = UserValidator.validateCreate(invalidUser);
            expect(result.isValid).toBe(false);
            expect(result.message).toBe('Last name must be at least 2 characters long');
        });

        it('should fail with invalid role_id', () => {
            const invalidUser = { ...validUser, role_id: 0 };
            const result = UserValidator.validateCreate(invalidUser);
            expect(result.isValid).toBe(false);
            expect(result.message).toBe('Invalid role ID');
        });
    });

    describe('validateUpdate', () => {
        const validUpdate: IUpdateUserDto = {
            id: 1,
            email: 'test@example.com',
            password: 'Password123',
            first_name: 'John',
            last_name: 'Doe',
            role_id: 1,
            active: true
        };

        it('should validate a correct update', () => {
            const result = UserValidator.validateUpdate(validUpdate);
            expect(result.isValid).toBe(true);
        });

        it('should validate partial update', () => {
            const partialUpdate: IUpdateUserDto = {
                id: 1,
                email: 'new@example.com'
            };
            const result = UserValidator.validateUpdate(partialUpdate);
            expect(result.isValid).toBe(true);
        });

        it('should fail with empty update', () => {
            const emptyUpdate: IUpdateUserDto = { id: 1 };
            const result = UserValidator.validateUpdate(emptyUpdate);
            expect(result.isValid).toBe(false);
            expect(result.message).toBe('At least one field must be provided for update');
        });

        it('should fail with invalid email in update', () => {
            const invalidUpdate = { ...validUpdate, email: 'invalid-email' };
            const result = UserValidator.validateUpdate(invalidUpdate);
            expect(result.isValid).toBe(false);
            expect(result.message).toBe('Invalid email format');
        });

        it('should fail with invalid password in update', () => {
            const invalidUpdate = { ...validUpdate, password: 'short' };
            const result = UserValidator.validateUpdate(invalidUpdate);
            expect(result.isValid).toBe(false);
            expect(result.message).toBe('Password must be at least 8 characters long and contain at least one number');
        });
    });

    describe('validateFindByEmail', () => {
        it('should validate a correct email', () => {
            const result = UserValidator.validateFindByEmail('test@example.com');
            expect(result.isValid).toBe(true);
        });

        it('should fail with empty email', () => {
            const result = UserValidator.validateFindByEmail('');
            expect(result.isValid).toBe(false);
            expect(result.message).toBe('Email is required');
        });

        it('should fail with invalid email format', () => {
            const result = UserValidator.validateFindByEmail('invalid-email');
            expect(result.isValid).toBe(false);
            expect(result.message).toBe('Invalid email format');
        });
    });
}); 