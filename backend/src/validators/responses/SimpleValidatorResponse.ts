export class SimpleValidatorResponse {
    constructor(
        public readonly isValid: boolean,
        public readonly message: string
    ) {}

    static valid(message: string = 'Validation successful'): SimpleValidatorResponse {
        return new SimpleValidatorResponse(true, message);
    }

    static invalid(message: string): SimpleValidatorResponse {
        return new SimpleValidatorResponse(false, message);
    }
}
