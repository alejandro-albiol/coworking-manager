import { BaseHttpResponse } from "./base/BaseHttpResponse";

export class HttpResponse<T> extends BaseHttpResponse<T> {
    private constructor(data: T | null, message: string, statusCode: number) {
        super(data, message, statusCode);
    }

    static ok<T>(data: T, message: string = 'Operation successful'): HttpResponse<T> {
        return new HttpResponse(data, message, 200);
    }

    static created<T>(data: T, message: string = 'Resource created successfully'): HttpResponse<T> {
        return new HttpResponse(data, message, 201);
    }

    static accepted<T>(data: T, message: string = 'Request accepted'): HttpResponse<T> {
        return new HttpResponse(data, message, 202);
    }

    static noContent(message: string = 'Operation completed'): HttpResponse<null> {
        return new HttpResponse(null, message, 204);
    }
} 