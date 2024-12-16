import { HashService } from '../../src/services/HashService';

describe('HashService', () => {
    it('should verify password correctly', async () => {
        const password = 'testPassword';
        const hash = await HashService.hash(password);
        
        const result = await HashService.verify(password, hash);
        expect(result).toBe(true);
    });

    it('should fail on wrong password', async () => {
        const password = 'testPassword';
        const wrongPassword = 'wrongPassword';
        const hash = await HashService.hash(password);
        
        const result = await HashService.verify(wrongPassword, hash);
        expect(result).toBe(false);
    });
});
