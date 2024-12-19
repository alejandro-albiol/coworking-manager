import { IBaseRepository } from "../../interfaces/repositories/IBaseRepository";
import { Database } from "../../database/Database";

export abstract class BaseRepository<T, CreateDto, UpdateDto> implements IBaseRepository<T, CreateDto, UpdateDto> {
    public constructor(protected readonly database: Database) {}

    abstract create(data: CreateDto, schema: string): Promise<T>;
    abstract findById(id: number, schema: string): Promise<T | null>;
    abstract findAll(schema: string): Promise<T[]>;
    abstract update(data: UpdateDto, schema: string): Promise<T>;
    abstract delete(id: number, schema: string): Promise<void>;

    protected async getClient(schema: string) {
        return await this.database.getClient(schema);
    }
}
