using API.Models;

namespace API.Dtos.OrderManager;

public class OrderManagerCreateRequest
{
    public Guid CustomerId { get; set; } = Guid.NewGuid();
    public Guid ProductId { get; set; }
    public int Quantity { get; set; }
    public decimal SubTotal { get; set; }
    public decimal TotalAmount { get; set; }
}
