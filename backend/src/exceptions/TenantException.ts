import { BaseException } from "./base/BaseException";

export class TenantException extends BaseException {
    constructor(message: string, statusCode: number = 400) {
        super(message, statusCode);
    }

    getMessage(): string {
        return this.message;
    }

    getStatusCode(): number {
        return this.statusCode;
    }

    static notFound(id: number): TenantException {
        return new TenantException(`Tenant with id ${id} not found`, 404);
    }

    static alreadyExists(subdomain: string): TenantException {
        return new TenantException(`Tenant with subdomain ${subdomain} already exists`, 409);
    }

    static invalidData(message: string): TenantException {
        return new TenantException(`Invalid tenant data: ${message}`, 400);
    }
} 