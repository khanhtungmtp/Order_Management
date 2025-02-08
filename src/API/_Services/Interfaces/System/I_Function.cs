using API.Dtos.System;
using API.Helpers.Base;
using API.Helpers.Utilities;
using static API.Configurations.DependencyInjectionConfig;

namespace API._Services.Interfaces.System;

[DependencyInjection(ServiceLifetime.Scoped)]
public interface I_Function
{
    Task<OperationResult<string>> CreateAsync(FunctionCreateRequest request);
    Task<OperationResult<FunctionVM>> FindByIdAsync(string id);
    Task<OperationResult<List<FunctionVM>>> GetParentIdsAsync();
    Task<OperationResult<PagingResult<FunctionVM>>> GetPagingAsync(string? filter, PaginationParam pagination);
    Task<OperationResult<string>> PutAsync(string id, FunctionCreateRequest request);
    Task<OperationResult<string>> DeleteAsync(string id);
    Task<OperationResult> DeleteRangeAsync(List<string> ids);
}
