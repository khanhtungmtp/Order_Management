namespace API.Dtos.UserManager;

public class RoleVM
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
}

public class PermissionVmRole
{
    public string FunctionId { get; set; } = string.Empty;

    public string CommandId { get; set; } = string.Empty;
}

