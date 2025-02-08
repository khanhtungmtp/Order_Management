using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models.Common;

[Table("Functions")]
public class Function
{
    [Key]
    [MaxLength(50)]
    [Column(TypeName = "varchar(50)")]
    public string Id { get; set; } = string.Empty;

    [MaxLength(200)]
    [Required]
    public required string Name { get; set; }

    [MaxLength(200)]
    [Required]
    public required string Url { get; set; }

    [Required]
    public int SortOrder { get; set; }

    [MaxLength(50)]
    [Column(TypeName = "varchar(50)")]
    public string ParentId { get; set; } = string.Empty;

    [MaxLength(50)]
    [Column(TypeName = "varchar(50)")]
    public string Icon { get; set; } = string.Empty;
}
