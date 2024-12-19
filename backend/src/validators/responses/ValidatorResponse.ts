import { BaseValidatorResponse } from "./base/BaseValidatorResponse";

export class ValidatorResponse<T> extends BaseValidatorResponse<T> {
    private constructor(data: T | null, isValid: boolean, message: string) {
        super(data, isValid, message);
    }

    static valid<T>(data: T, message: string = 'Validation successful'): ValidatorResponse<T> {
        return new ValidatorResponse(data, true, message);
    }

    static invalid<T = null>(message: string = 'Validation failed'): ValidatorResponse<T> {
        return new ValidatorResponse<T>(null, false, message);
    }
} 