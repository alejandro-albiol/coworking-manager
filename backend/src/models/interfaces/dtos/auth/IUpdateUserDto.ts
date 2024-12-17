export interface IUpdateUserDto {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role_id: number;
    active: boolean;
}
