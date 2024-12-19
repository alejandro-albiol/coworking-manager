export interface IBaseRepository<T, CreateDto, UpdateDto> {
    create(data: CreateDto, schema: string): Promise<T>;
    findById(id: number, schema: string): Promise<T | null>;
    findAll(schema: string): Promise<T[]>;
    update(data: UpdateDto, schema: string): Promise<T>;
    delete(id: number, schema: string): Promise<void>;
} 