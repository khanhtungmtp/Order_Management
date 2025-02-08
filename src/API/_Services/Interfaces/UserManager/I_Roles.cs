using API.Dtos.System;
using API.Helpers.Base;
using static API.Configurations.DependencyInjectionConfig;

namespace API._Services.Interfaces.UserManager;

[DependencyInjection(ServiceLifetime.Scoped)]
public interface I_Roles
{
    Task<OperationResult<List<PermissionScreenVm>>> GetAllPermissionTree();
    Task<OperationResult<List<PermissionVm>>> GetPermissionByRoleId(string roleId);
    Task<OperationResult<string>> PutPermissionByRoleId(string roleId, List<PermissionVm> request);
}
