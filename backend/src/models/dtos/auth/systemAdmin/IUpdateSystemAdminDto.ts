export interface IUpdateSystemAdminDto {
    id: number;
    email?: string;
    password_hash?: string;
    name?: string;
    active?: boolean;
} 