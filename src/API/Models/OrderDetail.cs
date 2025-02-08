using System.ComponentModel.DataAnnotations;

namespace API.Models;

public class OrderDetail
{
    [Key]
    public Guid OrderDetailId { get; set; }
    public Guid OrderId { get; set; }
    public Order Order { get; set; } = default!;
    public Guid ProductId { get; set; }
    public Product Product { get; set; } = default!;
    [Range(1, int.MaxValue, ErrorMessage = "Quantity must be >=1")]
    public int Quantity { get; set; }
    public decimal SubTotal { get; set; }
}