using API.Dtos.System;
using API.Helpers.Base;
using static API.Configurations.DependencyInjectionConfig;

namespace API._Services.Interfaces.System;

[DependencyInjection(ServiceLifetime.Scoped)]
public interface I_Permissions
{
    Task<OperationResult<List<PermissionScreenVm>>> GetCommandViews();
}
