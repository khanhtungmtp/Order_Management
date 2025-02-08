using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models.Common;

[Table("Commands")]
public class Command
{
    [MaxLength(50)]
    [Column(TypeName = "varchar(50)")]
    [Key]
    public string Id { get; set; } = string.Empty;

    [MaxLength(50)]
    [Required]
    public required string Name { get; set; }
}
