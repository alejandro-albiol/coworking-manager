import { IException } from "../../interfaces/exceptions/IException";

export abstract class BaseException extends Error implements IException {
    constructor(
        public readonly message: string,
        public readonly statusCode: number = 500
    ) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }

    abstract getMessage(): string;
    abstract getStatusCode(): number;
    
    getErrorResponse(): { message: string; statusCode: number } {
        return {
            message: this.getMessage(),
            statusCode: this.getStatusCode()
        };
    }
} 
