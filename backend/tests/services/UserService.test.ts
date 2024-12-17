process.env.NODE_ENV = 'test';

import { config } from '../../src/config/database';
import { UserService } from '../../src/services/UserService';

describe('UserService', () => {
    beforeAll(() => {
        console.log('Loaded database config:', {
            ...config.database,
            password: config.database.password ? 'REDACTED' : 'undefined'
        });
    });

    test('should insert a new user', async () => {
        const newUser = {
            email: 'test@example.com',
            password: 'testPassword123',
            first_name: 'Test',
            last_name: 'User',
            role_id: 1
        };

        const result = await UserService.insertNewUser(newUser, config.database.defaultSchema);
        expect(result.isSuccess).toBe(true);
        expect(result.data).toBeDefined();
    });
});