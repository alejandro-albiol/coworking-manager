export abstract class BaseValidator {
    protected static validateLength(value: string, max: number, min: number = 0): boolean {
        if (!value) return true;
        return value.length >= min && value.length <= max;
    }

    protected static validatePattern(value: string, pattern: RegExp): boolean {
        if (!value) return true;
        return pattern.test(value);
    }

    protected static isEmpty(value: string): boolean {
        return !value || value.trim() === '';
    }

    protected static isUnique(value: string, existingValues: string[]): boolean {
        return !existingValues.includes(value);
    }
}
