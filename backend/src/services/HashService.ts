import argon2 from 'argon2';
import { DataBaseResponse } from '../models/responses/DataBaseResponse';

export class HashService {
    static async hash(password: string): Promise<DataBaseResponse<string>> {
        try {
            const hashedPassword = await argon2.hash(password);
            return { isSuccess: true, message: 'Password hashed successfully', data: hashedPassword };
        } catch (error) {
            return { isSuccess: false, message: 'Failed to hash password', data: null };
        }
    }

    static async verify(password: string, hash: string): Promise<DataBaseResponse<boolean>> {
        try {
            const isVerified = await argon2.verify(hash, password);
            return { isSuccess: true, message: 'Password verified successfully', data: isVerified };
        } catch (error) {
            return { isSuccess: false, message: 'Failed to verify password', data: false };
        }
    }
}