
using API.Dtos.System;
using API.Helpers.Base;
using static API.Configurations.DependencyInjectionConfig;

namespace API._Services.Interfaces.System;

[DependencyInjection(ServiceLifetime.Scoped)]
public interface I_CommandInFunction
{
    Task<OperationResult<List<CommandVM>>> GetCommandsAsync();
    Task<OperationResult<CommandInFunctionResponseVM>> CreateAsync(string functionId, CommandAssignRequest request);
    Task<OperationResult> DeleteAsync(string functionId, CommandAssignRequest request);
}
