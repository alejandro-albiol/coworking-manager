export interface IUser {
    id: number;
    email: string;
    password_hash: string;
    first_name?: string;
    last_name?: string;
    role_id?: number;
    active: boolean;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
}