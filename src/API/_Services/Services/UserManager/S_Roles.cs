using API._Repositories;
using API._Services.Interfaces.UserManager;
using API.Dtos.System;
using API.Helpers.Base;
using API.Models.Common;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API._Services.Services.UserManager;
public class S_Roles(IRepositoryAccessor repoStore, RoleManager<IdentityRole> rolesManager) : BaseServices(repoStore), I_Roles
{
    private readonly RoleManager<IdentityRole> _rolesManager = rolesManager;
    public async Task<OperationResult<List<PermissionScreenVm>>> GetAllPermissionTree()
    {
        List<PermissionScreenVm>? data = await (
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
        return OperationResult<List<PermissionScreenVm>>.Success(data, "Get data successfully.");
    }

    public async Task<OperationResult<List<PermissionVm>>> GetPermissionByRoleId(string roleId)
    {
        List<PermissionVm>? permissions = await (from p in _repoStore.Permissions.FindAll(true)
                                                 join a in _repoStore.Commands.FindAll(true)
                                                 on p.CommandId equals a.Id
                                                 where p.RoleId == roleId
                                                 select new PermissionVm()
                                                 {
                                                     FunctionId = p.FunctionId,
                                                     CommandId = p.CommandId,
                                                     RoleId = p.RoleId
                                                 }).ToListAsync();
        return OperationResult<List<PermissionVm>>.Success(permissions, "Get permission by role id successfully.");
    }

    public async Task<OperationResult<string>> PutPermissionByRoleId(string roleId, List<PermissionVm> request)
    {
        if (request.Count == 0)
            return OperationResult<string>.NotFound("No permission selected");

        // Assuming _repoStore.Permissions is a DbSet<Permission>
        IQueryable<Permission>? currentPermissionsInDbQuery = _repoStore.Permissions.FindAll(p => p.RoleId == roleId);

        List<Permission>? currentPermissionsInDb = await currentPermissionsInDbQuery.ToListAsync();

        foreach (var item in request)
        {
            Permission? permission = new Permission(item.FunctionId, roleId, item.CommandId);

            if (!item.Checked)
            {
                Permission? existingPermission = await currentPermissionsInDbQuery
                    .FirstOrDefaultAsync(x => x.FunctionId == item.FunctionId && x.CommandId == item.CommandId);

                if (existingPermission != null)
                    _repoStore.Permissions.Remove(existingPermission);
            }
            else
            {
                bool exists = await currentPermissionsInDbQuery
                    .AnyAsync(x => x.FunctionId == item.FunctionId && x.CommandId == item.CommandId);

                if (!exists)
                    _repoStore.Permissions.Add(permission);
            }
        }

        // Save the changes
        await _repoStore.SaveChangesAsync();
        return OperationResult<string>.Success("Save permission successfully");
    }

    internal class MyPermissionComparer : IEqualityComparer<Permission>
    {
        // Items are equal if their ids are equal.
        public bool Equals(Permission? x, Permission? y)
        {
            // Check whether the compared objects reference the same data.
            if (ReferenceEquals(x, y)) return true;

            // Check whether any of the compared objects is null.
            if (x is null || y is null)
                return false;

            // Check whether the items' properties are equal.
            return x.CommandId == y.CommandId && x.FunctionId == y.FunctionId && x.RoleId == y.RoleId;
        }

        public int GetHashCode(Permission permission)
        {
            // Check whether the object is null
            if (permission is null) return 0;

            // Use HashCode.Combine to generate a hash code considering all the properties.
            return HashCode.Combine(permission.CommandId, permission.FunctionId, permission.RoleId);
        }
    }
}
