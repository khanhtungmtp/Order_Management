using API.Models;

namespace API.Dtos.OrderManager;

public class OrderManagerCreateRequest
{
    public Guid CustomerId { get; set; } = Guid.NewGuid();
    public List<OrderDetailDto> OrderDetails { get; set; } = [];
    public decimal TotalAmount { get; set; }
}
