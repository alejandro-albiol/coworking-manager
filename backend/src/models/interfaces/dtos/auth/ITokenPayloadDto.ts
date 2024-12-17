export interface ITokenPayloadDTO {
    userId: number;
    roleId?: number;
    iat?: number;
    exp?: number;
}