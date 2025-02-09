
namespace API.Dtos.OrderManager;

public class OrderDetailDto
{
    public Guid OrderDetailId { get; set; }
    public Guid OrderId { get; set; }
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }
    public int Quantity { get; set; }
    public decimal SubTotal { get; set; }
    public string SubTotal_str { get; set; } = string.Empty;
}
