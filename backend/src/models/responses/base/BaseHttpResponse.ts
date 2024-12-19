import { IHttpResponse } from "../../../interfaces/responses/IHttpResponse";

export abstract class BaseHttpResponse<T> implements IHttpResponse<T> {
    protected constructor(
        public readonly data: T | null,
        public readonly message: string,
        public readonly statusCode: number
    ) {}

    getResponse(): { data: T | null; message: string; statusCode: number } {
        return {
            data: this.data,
            message: this.message,
            statusCode: this.statusCode
        };
    }
} 