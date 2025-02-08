namespace API.Dtos.System;

public class PermissionVm
{
    public string FunctionId { get; set; } = string.Empty;

    public string RoleId { get; set; } = string.Empty;

    public string CommandId { get; set; } = string.Empty;
    public bool Checked { get; set; }
}
