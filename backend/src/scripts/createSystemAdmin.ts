import { DatabaseService } from '../services/DatabaseService';
import { HashService } from '../services/HashService';

async function createSystemAdmin(
    email: string,
    password: string,
    name: string
) {
    const client = await DatabaseService.getClient('public');
    if (!client.isSuccess || !client.data) {
        console.error('Failed to connect to database');
        return;
    }

    try {
        const existingAdmin = await client.data.query(
            'SELECT id FROM system_admins WHERE email = $1',
            [email]
        );

        if (existingAdmin.rows.length > 0) {
            console.error('Admin already exists');
            return;
        }

        const hashResult = await HashService.hash(password);
        if (!hashResult.isSuccess || !hashResult.data) {
            console.error('Failed to hash password');
            return;
        }

        await client.data.query(
            'INSERT INTO system_admins (email, password_hash, name, active) VALUES ($1, $2, $3, true)',
            [email, hashResult.data, name]
        );

        console.log('System admin created successfully');

    } catch (error) {
        console.error('Error creating system admin:', error);
    } finally {
        client.data.release();
    }
}

if (require.main === module) {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const name = process.env.ADMIN_NAME;

    if (!email || !password || !name) {
        console.error('Missing required environment variables');
        process.exit(1);
    }

    createSystemAdmin(email, password, name)
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
} 