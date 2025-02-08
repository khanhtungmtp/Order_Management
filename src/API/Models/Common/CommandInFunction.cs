using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models.Common;

[Table("CommandInFunctions")]
public class CommandInFunction
{
    [MaxLength(50)]
    [Column(TypeName = "varchar(50)")]
    [Required]
    public required string CommandId { get; set; }

    [MaxLength(50)]
    [Column(TypeName = "varchar(50)")]
    [Required]
    public required string FunctionId { get; set; }
}
