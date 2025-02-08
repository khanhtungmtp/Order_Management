namespace API.Dtos.System;
public class SystemDepartmentVM
{
    public int Id { get; set; }
    public required string Department_Name { get; set; }
    public int SortOrder { get; set; }
    public string ParentId { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public string? CreatedBy { get; set; }
    public string? UpdatedBy { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime UpdatedDate { get; set; }
}
