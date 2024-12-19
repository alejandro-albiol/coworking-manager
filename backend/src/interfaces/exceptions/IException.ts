export interface IException {
    message: string;
    statusCode: number;
    name: string;

    getMessage(): string;
    getStatusCode(): number;
    getErrorResponse(): { message: string; statusCode: number };
} 