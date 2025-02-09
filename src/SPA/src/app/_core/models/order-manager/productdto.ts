export interface ProductDto {
    productId: string;
    productName: string;
    price: number;
    stockQuantity: number;
}
export interface ProductRequest {
    productId: string;
    quantity: number;
}