import { IDatabase } from "../interfaces/database/IDatabase";
import { DataBaseResponse } from "../models/responses/DataBaseResponse";

export abstract class BaseRepository<T, CreateDto, UpdateDto> {
    protected readonly database: IDatabase;

    constructor(database: IDatabase) {
        this.database = database;
    }

    abstract create(dto: CreateDto, schema: string): Promise<DataBaseResponse<T>>;
    abstract findById(id: number, schema: string): Promise<DataBaseResponse<T>>;
    abstract update(dto: UpdateDto, schema: string): Promise<DataBaseResponse<T>>;
    abstract delete(id: number, schema: string): Promise<DataBaseResponse<T>>;
}
