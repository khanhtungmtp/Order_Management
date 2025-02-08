using System.ComponentModel.DataAnnotations;

namespace API.Dtos.OrderManager;

public class OrderDetailDto
{
    public Guid OrderDetailId { get; set; }
    public Guid OrderId { get; set; }
    public Guid ProductId { get; set; }
    [Range(1, int.MaxValue, ErrorMessage = "Quantity must be >=1")]
    public int Quantity { get; set; }
    public decimal SubTotal { get; set; }
}
