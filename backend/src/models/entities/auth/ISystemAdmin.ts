export interface ISystemAdmin {
    id: number;
    email: string;
    password_hash: string;
    name: string;
    active: boolean;
    created_at: Date;
    updated_at: Date;
} 