using System.ComponentModel.DataAnnotations;
using API.Helpers.Enum;

namespace API.Models;

public class Order
{
    [Key]
    public Guid OrderId { get; set; }
    public Guid CustomerId { get; set; }
    public Customer Customer { get; set; } = default!;
    public DateTime OrderDate { get; set; }
    public decimal TotalAmount { get; set; }
    public OrderStatus Status { get; set; }
    public ICollection<OrderDetail> OrderDetails { get; set; } = [];
}