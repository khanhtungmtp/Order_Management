using System.ComponentModel.DataAnnotations;

namespace API.Models.Common;

public partial class SystemLanguage
{
    [Key]
    [Required]
    [MaxLength(50)]
    public string Id { get; set; } = string.Empty;
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;
    [Required]
    public string UrlImage { get; set; } = string.Empty;
    public int SortOrder { get; set; }

    [Required]
    public bool IsActive { get; set; } = true;
}