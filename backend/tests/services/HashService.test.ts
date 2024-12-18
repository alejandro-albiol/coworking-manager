import { HashService } from '../../src/services/core/HashService';

describe('HashService', () => {
    it('should verify password correctly', async () => {
        const password = 'testPassword';
        const hash = await new HashService().hash(password);
        if (!hash) {
            throw new Error('Hash not generated');
        }
        const result = await new HashService().compare(password, hash);
        expect(result).toBe(true);
    });

    it('should fail on wrong password', async () => {
        const password = 'testPassword';
        const wrongPassword = 'wrongPassword';
        const hash = await new HashService().hash(password);
        if (!hash) {
            throw new Error('Hash not generated');
        }
        const result = await new HashService().compare(wrongPassword, hash);
        expect(result).toBe(false);
    });
});
