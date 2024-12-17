import { HashService } from '../../src/services/HashService';

describe('HashService', () => {
    it('should verify password correctly', async () => {
        const password = 'testPassword';
        const hash = await HashService.hash(password);
        if (!hash.data) {
            throw new Error('Hash not generated');
        }
        const result = await HashService.verify(password, hash.data);
        expect(result.data).toBe(true);
    });

    it('should fail on wrong password', async () => {
        const password = 'testPassword';
        const wrongPassword = 'wrongPassword';
        const hash = await HashService.hash(password);
        if (!hash.data) {
            throw new Error('Hash not generated');
        }
        const result = await HashService.verify(wrongPassword, hash.data);
        expect(result.data).toBe(false);
    });
});
