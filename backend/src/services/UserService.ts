import { ICreateUserDto } from "../models/interfaces/dtos/auth/ICreateUserDto";
import { IUser } from "../models/interfaces/entities/IUser";
import { DataBaseResponse } from "../models/responses/DataBaseResponse";
import { HashService } from "./HashService";
import { DatabaseService } from "./DatabaseService";

export class UserService {
    static async insertNewUser(userToCreate: ICreateUserDto, schema: string): Promise<DataBaseResponse<IUser>> {
        const clientResponse = await DatabaseService.getClient(schema);
        if (!clientResponse.isSuccess) {
            throw new Error('Database connection failed');
        }

        const client = clientResponse.data;
        try {
            if (!client) {
                throw new Error('Database connection failed');
            }
            const hashedPassword = await HashService.hash(userToCreate.password);
            const result = await client.query(
                'INSERT INTO users (email, password_hash, first_name, last_name, role_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [userToCreate.email, hashedPassword, userToCreate.first_name, userToCreate.last_name, userToCreate.role_id]
            );
            return {
                isSuccess: true,
                message: 'User inserted successfully',
                data: result.rows[0]
            };
        } finally {
            if (client) {
                client.release();
            }
        }
    }

    static async findUserByEmail(email: string, schema: string): Promise<DataBaseResponse<IUser>> {
        const clientResponse = await DatabaseService.getClient(schema);
        if (!clientResponse.isSuccess) {
            throw new Error('Database connection failed');
        }

        const client = clientResponse.data;
        try{
            if (!client) {
                throw new Error('Database connection failed');
            }
        const query = 'SELECT * FROM users WHERE email = $1';
        const values = [email];
        const result = await client.query(query, values);
        return {
            isSuccess: true,
            message: 'User found successfully',
                data: result.rows[0] || null
            };
        } finally {
            if (client) {
                client.release();
            }
        }
    }

    static async findUserById(id: string, schema: string): Promise<DataBaseResponse<IUser>> {
        const clientResponse = await DatabaseService.getClient(schema);
        if (!clientResponse.isSuccess) {
            throw new Error('Database connection failed');
        }

        const client = clientResponse.data;
        if (!client) {
            throw new Error('Database connection failed');
        }
        const query = 'SELECT * FROM users WHERE id = $1';
        const values = [id];
        const result = await client.query(query, values);
        return {
            isSuccess: true,
            message: 'User found successfully',
            data: result.rows[0] || null
        };
    }

    static async authenticateUser(email: string, password: string, schema: string): Promise<DataBaseResponse<IUser>> {
        const userResponse = await UserService.findUserByEmail(email, schema);
        if (!userResponse.isSuccess) {
            return { isSuccess: false, message: 'User not found', data: null };
        }
        const user = userResponse.data;
        if (!user) {
            return { isSuccess: false, message: 'User not found', data: null };
        }
        const isPasswordValid = await HashService.verify(password, user.password_hash);
        return isPasswordValid ? { 
            isSuccess: true, 
            message: 'User authenticated successfully', 
            data: user 
        } : { 
            isSuccess: false, 
            message: 'Invalid password', 
            data: null 
        };
    }
}
