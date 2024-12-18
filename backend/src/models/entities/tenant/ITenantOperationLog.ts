export interface ITenantOperationLog {
    id: number;
    admin_id: number;
    tenant_id: number;
    operation_type: string;
    details: any;
    created_at: Date;
} 