import { DatabaseService } from '../../src/services/core/DatabaseService';

describe('DatabaseService', () => {
    const existingTenant = {
        subdomain: 'demo',
        schema_name: 'tenant_1'
    };

    test('should get existing tenant', async () => {
        const result = await DatabaseService.getTenant(existingTenant.subdomain);
        
        expect(result.isSuccess).toBe(true);
        expect(result.data).toBeDefined();
        expect(result.data?.subdomain).toBe(existingTenant.subdomain);
        expect(result.data?.schema_name).toBe(existingTenant.schema_name);
    });

    test('should get client with correct schema', async () => {
        const database = new DatabaseService();
        const result = await database.getClient(existingTenant.schema_name);
        
        expect(result.isSuccess).toBe(true);
        expect(result.data).toBeDefined();
        
        if (result.data) {
            const schemaResult = await result.data.query('SELECT current_schema()');
            expect(schemaResult.rows[0].current_schema).toBe(existingTenant.schema_name);
            result.data.release();
        }
    });

    test('should fail to get non-existent tenant', async () => {
        const result = await DatabaseService.getTenant('non_existent_tenant');
        
        expect(result.isSuccess).toBe(true);
        expect(result.data).toBeNull();
    });
});
