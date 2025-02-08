using System.ComponentModel.DataAnnotations;

namespace API.Models;

public class Customer
{
    [Key]
    public Guid CustomerId { get; set; }
    [MaxLength(100)]
    [Required]
    public string FullName { get; set; } = string.Empty;
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    [MaxLength(15)]
    public string PhoneNumber { get; set; } = string.Empty;
    [MaxLength(200)]
    public string Address { get; set; } = string.Empty;
    public ICollection<Order> Orders { get; set; } = [];
}