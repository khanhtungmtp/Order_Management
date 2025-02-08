using API._Repositories;
using API._Services.Interfaces.System;
using API.Dtos.System;
using API.Helpers.Base;
using Microsoft.EntityFrameworkCore;

namespace API._Services.Services.System;
public class S_Permissions(IRepositoryAccessor repoStore) : BaseServices(repoStore), I_Permissions
{
    public async Task<OperationResult<List<PermissionScreenVm>>> GetCommandViews()
    {
        var result = await (
        from f in _repoStore.Functions.FindAll(true)
        join cif in _repoStore.CommandInFunctions.FindAll(true) on f.Id equals cif.FunctionId into functionCommands
        from sa in functionCommands.DefaultIfEmpty()
        group sa by new { f.Id, f.Name, f.ParentId } into grouped
        orderby grouped.Key.ParentId
        select new PermissionScreenVm()
        {
            Id = grouped.Key.Id,
            Name = grouped.Key.Name,
            ParentId = grouped.Key.ParentId,
            HasCreate = grouped.Any(x => x != null && x.CommandId == "CREATE"),
            HasUpdate = grouped.Any(x => x != null && x.CommandId == "UPDATE"),
            HasDelete = grouped.Any(x => x != null && x.CommandId == "DELETE"),
            HasView = grouped.Any(x => x != null && x.CommandId == "VIEW"),
            HasApprove = grouped.Any(x => x != null && x.CommandId == "APPROVE")
        }
        ).ToListAsync();
        return OperationResult<List<PermissionScreenVm>>.Success(result, "Get command views successfully.");
    }
}
