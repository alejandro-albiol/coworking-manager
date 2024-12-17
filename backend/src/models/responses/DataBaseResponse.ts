export interface DataBaseResponse<T> {
    isSuccess: boolean;
    message: string;
    data: T | null;
}