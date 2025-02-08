import { OrderDetailDto } from "./orderdetaildto";

export interface OrderManagerCreateRequest {
    customerId: string;
    orderDetails: OrderDetailDto[];
    totalAmount: number;
}