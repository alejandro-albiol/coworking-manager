import { TokenService } from '../../src/services/TokenService';

describe('TokenService', () => {
    const jwtSecret = 'test_secret';

    it('should generate token correctly', () => {
        const payload = { userId: 1 };
        const token = TokenService.generateToken(payload, jwtSecret);
        
        expect(token).toBeDefined();
        expect(typeof token).toBe('string');
    });

    it('should verify token correctly', () => {
        const payload = { userId: 1 };
        const token = TokenService.generateToken(payload, jwtSecret);
        
        const decoded = TokenService.verifyToken(token, jwtSecret);
        expect(decoded).toBeDefined();
        expect(decoded.userId).toBe(payload.userId);
    });

    it('should throw on invalid token', () => {
        expect(() => {
            TokenService.verifyToken('invalid_token', jwtSecret);
        }).toThrow();
    });

    it('should throw when secret is not provided', () => {
        expect(() => {
            TokenService.generateToken({}, '');
        }).toThrow('JWT_SECRET is required');
    });
});
