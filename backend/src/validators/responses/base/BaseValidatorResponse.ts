export abstract class BaseValidatorResponse<T> {
    protected constructor(
        public readonly data: T | null,
        public readonly isValid: boolean,
        public readonly message: string
    ) {}

    getResponse(): { data: T | null; isValid: boolean; message: string } {
        return {
            data: this.data,
            isValid: this.isValid,
            message: this.message
        };
    }
} 