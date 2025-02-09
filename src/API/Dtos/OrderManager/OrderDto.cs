using API.Helpers.Enum;

namespace API.Dtos.OrderManager;

public class OrderDto
{
    public Guid OrderId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public Guid CustomerId { get; set; }
    public DateTime OrderDate { get; set; }
    public decimal TotalAmount { get; set; }
    public OrderStatus Status { get; set; }
}
