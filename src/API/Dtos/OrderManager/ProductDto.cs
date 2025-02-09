namespace API.Dtos.OrderManager;

public class ProductDto
{
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }
}

public class ProductRequest
{
    public Guid ProductId { get; set; } = Guid.Empty;
    public int Quantity { get; set; }

}

public class ProductTotalResponse
{
    public int Total { get; set; }

}