import { DatabaseService } from '../../src/services/core/DatabaseService';
import { RoleService } from '../../src/services/domain/RoleService';

describe('RoleService Integration Tests', () => {
    const testSchema = 'tenant_1';
    let database: DatabaseService;

    beforeAll(async () => {
        database = new DatabaseService();
        const client = await database.getClient(testSchema);
        
        // Establecer explícitamente el schema
        await client.data?.query(`SET search_path TO ${testSchema}`);
        
        // Verificar que podemos acceder a la tabla
        try {
            const result = await client.data?.query('SELECT * FROM roles LIMIT 1');
            console.log('Can query roles table:', result);
        } catch (error) {
            console.error('Error accessing roles table:', error);
        }
        
        client.data?.release();
    });

    it('should create a new role successfully', async () => {
        const newRole = {
            name: 'test_role_' + Date.now(),
            description: 'Test role description'
        };

        const result = await RoleService.insertNewRole(newRole, testSchema);

        expect(result.isSuccess).toBe(true);
        expect(result.data).toHaveProperty('id');
        expect(result.data?.name).toBe(newRole.name);
    });

    it('should not create a system role', async () => {
        const systemRole = {
            name: 'TENANT_ADMIN',
            description: 'Try to create admin role'
        };

        const result = await RoleService.insertNewRole(systemRole, testSchema);

        expect(result.isSuccess).toBe(false);
        expect(result.message).toBe('Role name is reserved');
    });
});
