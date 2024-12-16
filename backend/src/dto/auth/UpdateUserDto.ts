export class UpdateUserDto {
    email?: string;
    password?: string;
    first_name?: string;
    last_name?: string;
    role_id?: number;
    active?: boolean;

    constructor(data: Partial<UpdateUserDto>) {
        if (data.email) this.email = data.email.toLowerCase().trim();
        if (data.password) this.password = data.password;
        if (data.first_name) this.first_name = data.first_name.trim();
        if (data.last_name) this.last_name = data.last_name.trim();
        if (data.role_id) this.role_id = data.role_id;
        if (data.active !== undefined) this.active = data.active;
    }

    validate(): boolean {
        return (
            (!this.email || this.email.includes('@')) &&
            (!this.password || this.password.length >= 8) &&
            (!this.first_name || this.first_name.length >= 2) &&
            (!this.last_name || this.last_name.length >= 2)
        );
    }
}
