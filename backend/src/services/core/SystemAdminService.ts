import { IDatabase } from "../../interfaces/database/IDatabase";
import { ISystemAdminService } from "../../interfaces/services/ISystemAdminService";
import { ICreateSystemAdminInputDto } from "../../models/dtos/auth/systemAdmin/ICreateSystemAdminInputDto";
import { ICreateSystemAdminDto } from "../../models/dtos/auth/systemAdmin/ICreateSystemAdminDto";
import { ISystemAdmin } from "../../models/entities/auth/ISystemAdmin";
import { DataBaseResponse } from "../../models/responses/DataBaseResponse";
import { SystemAdminRepository } from "../../repositories/SystemAdminRepository";
import { HashService } from "./HashService";

export class SystemAdminService implements ISystemAdminService {
    private readonly hashService: HashService;

    constructor(private readonly database: IDatabase) {
        this.hashService = new HashService();
    }

    async createAdmin(adminInput: ICreateSystemAdminInputDto): Promise<DataBaseResponse<ISystemAdmin>> {
        let client;
        try {            
            const clientResponse = await this.database.getClient('public');
            if (!clientResponse.isSuccess || !clientResponse.data) {
                throw new Error('Database connection failed');
            }
            client = clientResponse.data;

            const adminData: ICreateSystemAdminDto = {
                email: adminInput.email,
                password_hash: await this.hashService.hash(adminInput.password),
                name: adminInput.name
            };

            const systemAdminRepository = new SystemAdminRepository(this.database);
            return await systemAdminRepository.create(adminData, 'public');

        } catch (error) {
            return {
                isSuccess: false,
                message: error instanceof Error ? error.message : 'Failed to create admin',
                data: null
            };
        } finally {
            if (client) {
                client.release();
            }
        }
    }

    async findActiveAdmin(adminId: number): Promise<DataBaseResponse<ISystemAdmin>> {
        let client;
        try {
            const clientResponse = await this.database.getClient('public');
            if (!clientResponse.isSuccess || !clientResponse.data) {
                throw new Error('Database connection failed');
            }
            client = clientResponse.data;

            const systemAdminRepository = new SystemAdminRepository(this.database);
            return await systemAdminRepository.findActiveAdmin(adminId, 'public');

        } catch (error) {
            return {
                isSuccess: false,
                message: error instanceof Error ? error.message : 'Failed to find admin',
                data: null
            };
        } finally {
            if (client) {
                client.release();
            }
        }
    }

    async deleteAdmin(adminId: number): Promise<DataBaseResponse<ISystemAdmin>> {
        let client;
        try {
            const clientResponse = await this.database.getClient('public');
            if (!clientResponse.isSuccess || !clientResponse.data) {
                throw new Error('Database connection failed');
            }
            client = clientResponse.data;

            const systemAdminRepository = new SystemAdminRepository(this.database);
            return await systemAdminRepository.delete(adminId, 'public');

        } catch (error) {
            return {
                isSuccess: false,
                message: error instanceof Error ? error.message : 'Failed to delete admin',
                data: null
            };
        } finally {
            if (client) {
                client.release();
            }
        }
    }
} 