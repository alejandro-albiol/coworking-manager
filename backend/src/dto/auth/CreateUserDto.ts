import { IUser } from "../../interfaces/auth/IUser";

export class CreateUserDto {
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
    role_id?: number;

    constructor(data: Partial<CreateUserDto>) {
        this.email = data.email?.toLowerCase().trim() || '';
        this.password = data.password || '';
        this.first_name = data.first_name?.trim();
        this.last_name = data.last_name?.trim();
        this.role_id = data.role_id;
    }

    validate(): boolean {
        return (
            this.email.includes('@') &&
            this.password.length >= 8 &&
            (!this.first_name || this.first_name.length >= 2) &&
            (!this.last_name || this.last_name.length >= 2)
        );
    }

    toEntity(): Omit<IUser, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'password_hash'> {
        return {
            email: this.email,
            first_name: this.first_name,
            last_name: this.last_name,
            role_id: this.role_id,
            active: true
        };
    }
}
