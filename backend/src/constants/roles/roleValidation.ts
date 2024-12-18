export const ROLE_VALIDATION = {
    NAME: {
        MAX_LENGTH: 50,
        REQUIRED: true,
        UNIQUE: true,
        TYPE: 'varchar'
    },
    DESCRIPTION: {
        MAX_LENGTH: 255,
        REQUIRED: false,
        TYPE: 'text'
    }
} as const; 