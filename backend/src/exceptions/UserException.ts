import { BaseException } from "./base/BaseException";

export class UserException extends BaseException {
    constructor(message: string, statusCode: number = 400) {
        super(message, statusCode);
    }

    getMessage(): string {
        return this.message;
    }

    getStatusCode(): number {
        return this.statusCode;
    }

    static notFound(id: number): UserException {
        return new UserException(`User with id ${id} not found`, 404);
    }

    static invalidCredentials(): UserException {
        return new UserException('Invalid credentials', 401);
    }

    static alreadyExists(email: string): UserException {
        return new UserException(`User with email ${email} already exists`, 409);
    }

    static invalidData(message: string): UserException {
        return new UserException(`Invalid user data: ${message}`, 400);
    }
} 