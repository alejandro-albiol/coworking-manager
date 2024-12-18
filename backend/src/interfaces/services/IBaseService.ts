import { DataBaseResponse } from "../../models/responses/DataBaseResponse";
import { ValidatorResponse } from "../../models/responses/ValidatorResponse";
import { IDatabase } from "../database/IDatabase";
import { BaseRepository } from "../../repositories/BaseRepository";

export abstract class BaseService<T, CreateDto, UpdateDto> {
    protected readonly database: IDatabase;
    protected readonly repository: BaseRepository<T, CreateDto, UpdateDto>;

    constructor(database: IDatabase, repository: BaseRepository<T, CreateDto, UpdateDto>) {
        this.database = database;
        this.repository = repository;
    }

    protected abstract validateCreate(dto: CreateDto): ValidatorResponse;
    protected abstract validateUpdate(dto: UpdateDto): ValidatorResponse;
    protected abstract validateDelete(id: number): ValidatorResponse;

    async create(dto: CreateDto, schema: string): Promise<DataBaseResponse<T>> {
        const validation = this.validateCreate(dto);
        if (!validation.isValid) {
            return { isSuccess: false, message: validation.message, data: null };
        }

        let client;
        try {
            const clientResponse = await this.database.getClient(schema);
            if (!clientResponse.isSuccess || !clientResponse.data) {
                throw new Error('Database connection failed');
            }
            client = clientResponse.data;

            return await this.repository.create(dto, schema);
        } catch (error) {
            return { isSuccess: false, message: 'Failed to create record', data: null };
        } finally {
            if (client) {
                client.release();
            }
        }
    }

    async findById(id: number, schema: string): Promise<DataBaseResponse<T>> {
        return this.repository.findById(id, schema);
    }

    async update(dto: UpdateDto, schema: string): Promise<DataBaseResponse<T>> {
        const validation = this.validateUpdate(dto);
        if (!validation.isValid) {
            return { isSuccess: false, message: validation.message, data: null };
        }
        return this.repository.update(dto, schema);
    }

    async delete(id: number, schema: string): Promise<DataBaseResponse<T>> {
        const validation = this.validateDelete(id);
        if (!validation.isValid) {
            return { isSuccess: false, message: validation.message, data: null };
        }
        return this.repository.delete(id, schema);
    }
}