import jwt from 'jsonwebtoken';
import { ITokenPayload } from '../interfaces/auth/ITokenPayLoad';

export class TokenService {
    static generateToken(payload: object, jwtSecret: string): string {
        if (!jwtSecret) {
            throw new Error('JWT_SECRET is required');
        }
        return jwt.sign(payload, jwtSecret, { 
            expiresIn: '24h',
            algorithm: 'HS256'
        });
    }

    static verifyToken(token: string, jwtSecret: string): ITokenPayload {
        if (!jwtSecret) {
            throw new Error('JWT_SECRET is required');
        }
        return jwt.verify(token, jwtSecret) as ITokenPayload;
    }
}