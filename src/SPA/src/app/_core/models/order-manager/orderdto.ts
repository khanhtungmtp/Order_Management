import { OrderStatus } from "./orderstatus";

export interface OrderDto {
    orderId: string;
    customerId: string;
    customerName: string;
    orderDate: Date | string;
    totalAmount: number;
    status: OrderStatus;
}