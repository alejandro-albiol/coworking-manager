import jwt from 'jsonwebtoken';
import { ITokenPayloadDTO } from '../../interfaces/dtos/auth/token/ITokenPayloadDto';
import { DataBaseResponse } from '../../models/responses/DataBaseResponse';

export class TokenService {
    static generateToken(payload: object, jwtSecret: string): DataBaseResponse<string> {
        if (!jwtSecret) {
            return { isSuccess: false, message: 'JWT_SECRET is required', data: null };
        }
        try {
            const token = jwt.sign(payload, jwtSecret, { 
                expiresIn: '24h',
                algorithm: 'HS256'
            });
            return { isSuccess: true, message: 'Token generated successfully', data: token };
        } catch (error) {
            return { isSuccess: false, message: 'Failed to generate token', data: null };
        }
    }

    static verifyToken(token: string, jwtSecret: string): DataBaseResponse<ITokenPayloadDTO> {
        if (!jwtSecret) {
            return { isSuccess: false, message: 'JWT_SECRET is required', data: null };
        }
        try {
            const decoded = jwt.verify(token, jwtSecret) as ITokenPayloadDTO;
            return { isSuccess: true, message: 'Token verified successfully', data: decoded };
        } catch (error) {
            return { isSuccess: false, message: 'Failed to verify token', data: null };
        }
    }
}