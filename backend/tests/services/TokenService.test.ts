import { TokenService } from '../../src/services/TokenService';

describe('TokenService', () => {
    const jwtSecret = 'test_secret';

    it('should generate token correctly', () => {
        const payload = { userId: 1 };
        const result = TokenService.generateToken(payload, jwtSecret);
        
        expect(result.isSuccess).toBe(true);
        expect(result.data).toBeDefined();
        expect(typeof result.data).toBe('string');
    });

    it('should verify token correctly', () => {
        const payload = { userId: 1 };
        const tokenResult = TokenService.generateToken(payload, jwtSecret);
        expect(tokenResult.isSuccess).toBe(true);
        
        const decodedResult = TokenService.verifyToken(tokenResult.data!, jwtSecret);
        expect(decodedResult.isSuccess).toBe(true);
        expect(decodedResult.data?.userId).toBe(payload.userId);
    });

    it('should return failure on invalid token', () => {
        const result = TokenService.verifyToken('invalid_token', jwtSecret);
        expect(result.isSuccess).toBe(false);
        expect(result.message).toBe('Failed to verify token');
    });

    it('should return failure when secret is not provided', () => {
        const result = TokenService.generateToken({}, '');
        expect(result.isSuccess).toBe(false);
        expect(result.message).toBe('JWT_SECRET is required');
    });
});
