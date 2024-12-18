import dotenv from 'dotenv';
import { DatabaseService } from '../services/core/DatabaseService';
import { HashService } from '../services/core/HashService';
import { SystemAdminRepository } from '../repositories/SystemAdminRepository';

async function createInitialAdmin() {
    try {
        dotenv.config({ path: '.env.admin' });
        
        const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME } = process.env;
        
        if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !ADMIN_NAME) {
            console.error('Missing admin credentials in .env.admin');
            process.exit(1);
        }

        const database = new DatabaseService();
        const adminRepository = new SystemAdminRepository(database);

        const hashResult = await new HashService().hash(ADMIN_PASSWORD);
        if (!hashResult.isSuccess || !hashResult.data) {
            throw new Error('Failed to hash password');
        }

        const result = await adminRepository.create({
            email: ADMIN_EMAIL,
            password_hash: hashResult.data,
            name: ADMIN_NAME
        }, 'public');

        if (result.isSuccess) {
            console.log('Admin created successfully:', {
                email: ADMIN_EMAIL,
                name: ADMIN_NAME
            });
        } else {
            console.error('Failed to create admin:', result.message);
        }

    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

createInitialAdmin(); 