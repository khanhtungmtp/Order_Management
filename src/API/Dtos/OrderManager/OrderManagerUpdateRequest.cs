using API.Helpers.Enum;

namespace API.Dtos.OrderManager;

public class OrderManagerUpdateRequest
{
    public Guid OrderId { get; set; }
    public OrderStatus Status { get; set; }
}
