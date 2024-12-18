import { IUser } from "../../models/entities/auth/IUser";
import { DataBaseResponse } from "../../models/responses/DataBaseResponse";
import { HashService } from "../core/HashService";
import { DatabaseService } from "../core/DatabaseService";
import { IUserToAuthenticateDto } from "../../models/dtos/auth/user/IUserToAuthenticateDto";
import { IFindUserByEmailDto } from "../../models/dtos/auth/user/IFindUserByEmailDto";
import { IFindUserByIdDto } from "../../models/dtos/auth/user/IFindUserById";
import { IUpdateUserDto } from "../../models/dtos/auth/user/IUpdateUserDto";
import { IUserInputDto } from "../../models/dtos/auth/user/IUserInputDto";
import { UserRepository } from "../../repositories/UserRepository";
import { ICreateUserDto } from "../../models/dtos/auth/user/ICreateUserDto";
import { UserValidator } from "../../validators/user/UserValidator";

export class UserService {
    static async insertNewUser(userInput: IUserInputDto, schema: string): Promise<DataBaseResponse<IUser>> {
        const validation = UserValidator.validateCreate(userInput);
        if (!validation.isValid) {
            return { isSuccess: false, message: validation.message, data: null };
        }

        let client;
        try {
            const database = new DatabaseService();
            const userRepository = new UserRepository(database);
            const clientResponse = await database.getClient(schema);
            if (!clientResponse.isSuccess || !clientResponse.data) {
                throw new Error('Database connection failed');
            }
            client = clientResponse.data;
            
            const hashResponse = await new HashService().hash(userInput.password);
            if (!hashResponse) {
                throw new Error('Failed to hash password');
            }

            const userToCreate: ICreateUserDto = {
                email: userInput.email,
                password_hash: hashResponse,
                first_name: userInput.first_name,
                last_name: userInput.last_name,
                role_id: userInput.role_id
            };

            return userRepository.create(userToCreate, schema);
        } catch (error) {
            return { isSuccess: false, message: 'Failed to create user', data: null };
        } finally {
            if (client) {
                client.release();
            }
        }
    }

    static async findUserByEmail(userToFind: IFindUserByEmailDto, schema: string): Promise<DataBaseResponse<IUser>> {
        const validation = UserValidator.validateFindByEmail(userToFind.email);
        if (!validation.isValid) {
            return { isSuccess: false, message: validation.message, data: null };
        }

        let client;
        try {
            const database = new DatabaseService();
            const clientResponse = await database.getClient(schema);
            if (!clientResponse.isSuccess || !clientResponse.data) {
                throw new Error('Database connection failed');
            }

            client = clientResponse.data;
            
            const result = await client.query(
                'SELECT * FROM users WHERE email = $1',
                [userToFind.email]
            );

            return {
                isSuccess: true,
                message: 'User found successfully',
                data: result.rows[0] || null
            };
        } catch (error) {
            return { isSuccess: false, message: 'User not found', data: null };
        } finally {
            if (client) {
                client.release();
            }
        }
    }

    static async findUserById(userToFind: IFindUserByIdDto, schema: string): Promise<DataBaseResponse<IUser>> {
        const validation = UserValidator.validateFindById(userToFind.id);
        if (!validation.isValid) {
            return { isSuccess: false, message: validation.message, data: null };
        }

        let client;
        try {
            const database = new DatabaseService();
            const clientResponse = await database.getClient(schema);
            if (!clientResponse.isSuccess || !clientResponse.data) {
                throw new Error('Database connection failed');
            }

            client = clientResponse.data;
            
            const result = await client.query(
                'SELECT * FROM users WHERE id = $1',
                [userToFind.id]
            );

            return {
                isSuccess: true,
                message: 'User found successfully',
                data: result.rows[0] || null
            };
        } catch (error) {
            return { isSuccess: false, message: 'User not found', data: null };
        } finally {
            if (client) {
                client.release();
            }
        }
    }

    static async authenticateUser(userToAuthenticate: IUserToAuthenticateDto, schema: string): Promise<DataBaseResponse<IUser>> {
        const validation = UserValidator.validateAuthenticate(userToAuthenticate);
        if (!validation.isValid) {
            return { isSuccess: false, message: validation.message, data: null };
        }

        try {
            const userResponse = await UserService.findUserByEmail(
                { email: userToAuthenticate.email }, 
                schema
            );
            
            if (!userResponse.isSuccess || !userResponse.data) {
                return { isSuccess: false, message: 'User not found', data: null };
            }

            const verifyResponse = await new HashService().compare(
                userToAuthenticate.password, 
                userResponse.data.password_hash
            );

            if (!verifyResponse) {
                return { isSuccess: false, message: 'Invalid password', data: null };
            }

            return { 
                isSuccess: true, 
                message: 'User authenticated successfully', 
                data: userResponse.data 
            };
        } catch (error) {
            return { isSuccess: false, message: 'Authentication failed', data: null };
        }
    }

    static async updateUser(userToUpdate: IUpdateUserDto, schema: string): Promise<DataBaseResponse<IUser>> {
        const validation = UserValidator.validateUpdate(userToUpdate);
        if (!validation.isValid) {
            return { isSuccess: false, message: validation.message, data: null };
        }

        let client;
        try {
            const userExists = await UserService.findUserById({ id: userToUpdate.id }, schema);
            if (!userExists.isSuccess || !userExists.data) {
                return { isSuccess: false, message: 'User not found', data: null };
            }

            const database = new DatabaseService();
            const clientResponse = await database.getClient(schema);
            if (!clientResponse.isSuccess || !clientResponse.data) {
                throw new Error('Database connection failed');
            }

            client = clientResponse.data;

            const updates: string[] = [];
            const values: any[] = [];
            let paramCount = 1;

            if (userToUpdate.email && userToUpdate.email !== userExists.data.email) {
                updates.push(`email = $${paramCount}`);
                values.push(userToUpdate.email);
                paramCount++;
            }

            if (userToUpdate.password) {
                const hashResponse = await new HashService().hash(userToUpdate.password);
                if (!hashResponse) {
                    throw new Error('Failed to hash password');
                }
                updates.push(`password_hash = $${paramCount}`);
                values.push(hashResponse);
                paramCount++;
            }

            if (userToUpdate.first_name && userToUpdate.first_name !== userExists.data.first_name) {
                updates.push(`first_name = $${paramCount}`);
                values.push(userToUpdate.first_name);
                paramCount++;
            }

            if (userToUpdate.last_name && userToUpdate.last_name !== userExists.data.last_name) {
                updates.push(`last_name = $${paramCount}`);
                values.push(userToUpdate.last_name);
                paramCount++;
            }

            if (userToUpdate.role_id && userToUpdate.role_id !== userExists.data.role_id) {
                updates.push(`role_id = $${paramCount}`);
                values.push(userToUpdate.role_id);
                paramCount++;
            }

            if (typeof userToUpdate.active === 'boolean' && userToUpdate.active !== userExists.data.active) {
                updates.push(`active = $${paramCount}`);
                values.push(userToUpdate.active);
                paramCount++;
            }

            if (updates.length === 0) {
                return {
                    isSuccess: true,
                    message: 'No changes required',
                    data: userExists.data
                };
            }

            updates.push('updated_at = CURRENT_TIMESTAMP');

            values.push(userToUpdate.id);

            const query = `
                UPDATE users 
                SET ${updates.join(', ')} 
                WHERE id = $${paramCount}
                RETURNING *
            `;

            const result = await client.query(query, values);

            return {
                isSuccess: true,
                message: 'User updated successfully',
                data: result.rows[0]
            };
        } catch (error) {
            return { isSuccess: false, message: 'Failed to update user', data: null };
        } finally {
            if (client) {
                client.release();
            }
        }
    }
}
