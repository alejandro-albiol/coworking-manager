export interface ICreateUserDto {
    email: string;
    password_hash: string;
    first_name: string;
    last_name: string;
    role_id: number;
}