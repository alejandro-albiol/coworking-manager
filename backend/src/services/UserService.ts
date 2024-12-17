import { ICreateUserDto } from "../models/interfaces/dtos/auth/ICreateUserDto";
import { IUser } from "../models/interfaces/entities/IUser";
import { DataBaseResponse } from "../models/responses/DataBaseResponse";
import { HashService } from "./HashService";
import { DatabaseService } from "./DatabaseService";
import { IUserToAuthenticateDto } from "../models/interfaces/dtos/auth/IUserToAuthenticateDto";
import { IFindUserByEmailDto } from "../models/interfaces/dtos/auth/IFindUserByEmailDto";
import { IFindUserByIdDto } from "../models/interfaces/dtos/auth/IFindUserById";
import { IUpdateUserDto } from "../models/interfaces/dtos/auth/IUpdateUserDto";

export class UserService {
    static async insertNewUser(userToCreate: ICreateUserDto, schema: string): Promise<DataBaseResponse<IUser>> {
        let client;
        try {
            const clientResponse = await DatabaseService.getClient(schema);
            if (!clientResponse.isSuccess || !clientResponse.data) {
                throw new Error('Database connection failed');
            }

            client = clientResponse.data;
            
            const hashResponse = await HashService.hash(userToCreate.password);
            if (!hashResponse.isSuccess || !hashResponse.data) {
                throw new Error('Failed to hash password');
            }

            const result = await client.query(
                'INSERT INTO users (email, password_hash, first_name, last_name, role_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [userToCreate.email, hashResponse.data, userToCreate.first_name, userToCreate.last_name, userToCreate.role_id]
            );

            return {
                isSuccess: true,
                message: 'User inserted successfully',
                data: result.rows[0]
            };
        } catch (error) {
            return { isSuccess: false, message: 'User not inserted', data: null };
        } finally {
            if (client) {
                client.release();
            }
        }
    }

    static async findUserByEmail(userToFind: IFindUserByEmailDto, schema: string): Promise<DataBaseResponse<IUser>> {
        let client;
        try {
            const clientResponse = await DatabaseService.getClient(schema);
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
        let client;
        try {
            const clientResponse = await DatabaseService.getClient(schema);
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
        try {
            const userResponse = await UserService.findUserByEmail(
                { email: userToAuthenticate.email }, 
                schema
            );
            
            if (!userResponse.isSuccess || !userResponse.data) {
                return { isSuccess: false, message: 'User not found', data: null };
            }

            const verifyResponse = await HashService.verify(
                userToAuthenticate.password, 
                userResponse.data.password_hash
            );

            if (!verifyResponse.isSuccess || !verifyResponse.data) {
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
        let client;
        try {
            const userExists = await UserService.findUserById({ id: userToUpdate.id }, schema);
            if (!userExists.isSuccess || !userExists.data) {
                return { isSuccess: false, message: 'User not found', data: null };
            }

            const clientResponse = await DatabaseService.getClient(schema);
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
                const hashResponse = await HashService.hash(userToUpdate.password);
                if (!hashResponse.isSuccess || !hashResponse.data) {
                    throw new Error('Failed to hash password');
                }
                updates.push(`password_hash = $${paramCount}`);
                values.push(hashResponse.data);
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
