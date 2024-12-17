import { SpaceStatus } from "./SpaceStatus";

export interface ISpace {
    id: number;
    name: string;
    type_id?: number;
    capacity?: number;
    price_per_hour?: number;
    price_per_day?: number;
    price_per_month?: number;
    description?: string;
    status: SpaceStatus;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
}