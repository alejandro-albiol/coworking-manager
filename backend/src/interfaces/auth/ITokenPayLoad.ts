export interface ITokenPayload {
    userId: number;
    roleId?: number;
    active: boolean;
    iat?: number;
    exp?: number;
}