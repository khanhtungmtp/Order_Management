using System.ComponentModel.DataAnnotations;

namespace API.Models;

public class Product
{
    [Key]
    public Guid ProductId { get; set; }
    [MaxLength(100)]
    [Required]
    public string ProductName { get; set; } = string.Empty;
    [Required]
    [Range(0, double.MaxValue, ErrorMessage = "Price must be > 0.")]
    public decimal Price { get; set; }

    [Required]
    public int StockQuantity { get; set; }
}