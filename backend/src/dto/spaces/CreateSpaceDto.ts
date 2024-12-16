import { ISpace } from "../../interfaces/spaces/ISpace";
import { SpaceStatus } from "../../interfaces/spaces/SpaceStatus";

export class CreateSpaceDto {
    name: string;
    type_id?: number;
    capacity?: number;
    price_per_hour?: number;
    price_per_day?: number;
    price_per_month?: number;
    description?: string;
    status: SpaceStatus;

    constructor(data: Partial<CreateSpaceDto>) {
        this.name = data.name?.trim() || '';
        this.type_id = data.type_id;
        this.capacity = data.capacity;
        this.price_per_hour = data.price_per_hour;
        this.price_per_day = data.price_per_day;
        this.price_per_month = data.price_per_month;
        this.description = data.description?.trim();
        this.status = data.status || SpaceStatus.AVAILABLE;
    }

    validate(): boolean {
        return (
            this.name.length >= 3 &&
            (!this.capacity || this.capacity > 0) &&
            (!this.price_per_hour || this.price_per_hour >= 0) &&
            (!this.price_per_day || this.price_per_day >= 0) &&
            (!this.price_per_month || this.price_per_month >= 0)
        );
    }

    toEntity(): Omit<ISpace, 'id' | 'created_at' | 'updated_at' | 'deleted_at'> {
        return {
            name: this.name,
            type_id: this.type_id,
            capacity: this.capacity,
            price_per_hour: this.price_per_hour,
            price_per_day: this.price_per_day,
            price_per_month: this.price_per_month,
            description: this.description,
            status: this.status
        };
    }
}
