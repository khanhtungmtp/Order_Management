export interface OrderDetailDto {
    orderDetailId: string;
    orderId: string;
    customerName: string;
    productId: string;
    productName: string;
    price: number;
    stockQuantity: number;
    quantity: number;
    subTotal: number;
    subTotal_str: string;
}