export interface IHttpResponse<T> {
    data: T | null;
    message: string;
    statusCode: number;

    getResponse(): { 
        data: T | null; 
        message: string; 
        statusCode: number 
    };
} 