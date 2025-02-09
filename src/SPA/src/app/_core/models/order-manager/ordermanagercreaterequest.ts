export interface OrderManagerCreateRequest {
    customerId: string;
    productId: string;
    quantity: number;
    subTotal: number;
    totalAmount: number;
}