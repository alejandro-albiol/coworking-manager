import { BaseException } from "./base/BaseException";

export class SystemAdminException extends BaseException {
    constructor(message: string, statusCode: number = 400) {
        super(message, statusCode);
    }

    getMessage(): string {
        return this.message;
    }

    getStatusCode(): number {
        return this.statusCode;
    }

    static notFound(id: number): SystemAdminException {
        return new SystemAdminException(`System admin with id ${id} not found`, 404);
    }

    static invalidCredentials(): SystemAdminException {
        return new SystemAdminException('Invalid credentials', 401);
    }

    static alreadyExists(email: string): SystemAdminException {
        return new SystemAdminException(`System admin with email ${email} already exists`, 409);
    }

    static invalidData(message: string): SystemAdminException {
        return new SystemAdminException(`Invalid admin data: ${message}`, 400);
    }
}