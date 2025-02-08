import { OrderStatus } from "./orderstatus";

export interface OrderManagerUpdateRequest {
    orderId: string;
    status: OrderStatus;
}