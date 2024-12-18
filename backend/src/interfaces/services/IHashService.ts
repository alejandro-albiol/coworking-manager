import { DataBaseResponse } from "../../models/responses/DataBaseResponse";

export interface IHashService {
    hash(password: string): Promise<DataBaseResponse<string>>;
    verify(password: string, hash: string): Promise<DataBaseResponse<boolean>>;
}