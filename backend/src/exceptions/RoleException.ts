import { BaseException } from "./base/BaseException";

export class RoleException extends BaseException {
    constructor(message: string, statusCode: number = 400) {
        super(message, statusCode);
    }

    getMessage(): string {
        return this.message;
    }

    getStatusCode(): number {
        return this.statusCode;
    }

    static notFound(id: number): RoleException {
        return new RoleException(`Role with id ${id} not found`, 404);
    }

    static alreadyExists(name: string): RoleException {
        return new RoleException(`Role with name ${name} already exists`, 409);
    }

    static invalidData(message: string): RoleException {
        return new RoleException(`Invalid role data: ${message}`, 400);
    }
} 