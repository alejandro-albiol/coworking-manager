import dotenv from 'dotenv';
import { Database } from '../database/Database';
import { HashService } from '../services/core/HashService';
import { SystemAdminRepository } from '../repositories/SystemAdminRepository';

async function createInitialAdmin(): Promise<void> {
    try {
        dotenv.config();
        dotenv.config({ path: '.env.admin', override: true });
        
        const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME } = process.env;
        
        if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !ADMIN_NAME) {
            console.error('Missing admin credentials in .env.admin');
            process.exit(1);
        }

        const database = new Database();
        const adminRepository = new SystemAdminRepository(database);

        const hashResult = await new HashService().hash(ADMIN_PASSWORD);
        if (!hashResult) {
            throw new Error('Failed to hash password');
        }

        const result = await adminRepository.create({
            email: ADMIN_EMAIL,
            password_hash: hashResult,
            name: ADMIN_NAME
        }, 'public');

        if (result) {
            console.log('Admin created successfully:', {
                email: ADMIN_EMAIL,
                name: ADMIN_NAME
            });
        } else {
            console.error('Failed to create admin:', result);
        }

    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

createInitialAdmin(); 