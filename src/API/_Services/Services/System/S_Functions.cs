using API._Repositories;
using API._Services.Interfaces.System;
using API.Dtos.System;
using API.Helpers.Base;
using API.Helpers.Utilities;
using API.Models.Common;
using Microsoft.EntityFrameworkCore;

namespace API._Services.Services.System;

public class S_Function(IRepositoryAccessor repoStore) : BaseServices(repoStore), I_Function
{
    public async Task<OperationResult<string>> CreateAsync(FunctionCreateRequest request)
    {
        Function? functionExists = await _repoStore.Functions.FindByIdAsync(request.Id);
        if (functionExists is not null)
            return OperationResult<string>.Conflict("Function is existed.");
        Function? function = new()
        {
            Id = request.Id,
            Name = request.Name,
            ParentId = request.ParentId,
            SortOrder = request.SortOrder,
            Url = request.Url,
            Icon = request.Icon
        };

        await _repoStore.Functions.AddAsync(function);
        await _repoStore.SaveChangesAsync();
        return OperationResult<string>.Success(function.Id, "Function created successfully.");
    }

    public async Task<OperationResult<FunctionVM>> FindByIdAsync(string id)
    {
        Function? function = await _repoStore.Functions.FindByIdAsync(id);
        if (function is null)
            return OperationResult<FunctionVM>.NotFound("Function not found.");
        List<string>? commands = await GetListCommandByIdAsync(id);
        FunctionVM functionVM = new()
        {
            Id = function.Id,
            Name = function.Name,
            Url = function.Url,
            Icon = function.Icon,
            ParentId = function.ParentId,
            SortOrder = function.SortOrder,
            CommandInFunction = commands
        };
        return OperationResult<FunctionVM>.Success(functionVM, "Get function by id successfully.");
    }

    private async Task<List<string>> GetListCommandByIdAsync(string functionId)
    {
        var query = from cmd in _repoStore.Commands.FindAll(true)
                    join commandinfunc in _repoStore.CommandInFunctions.FindAll(true) on cmd.Id equals commandinfunc.CommandId into result1
                    from commandInFunction in result1.DefaultIfEmpty()
                    join func in _repoStore.Functions.FindAll(true) on commandInFunction.FunctionId equals func.Id into result2
                    from function in result2.DefaultIfEmpty()
                    select new
                    {
                        cmd.Id,
                        cmd.Name,
                        commandInFunction.FunctionId
                    };

        query = query.Where(x => x.FunctionId == functionId);

        List<string>? data = await query.Select(x => x.Id).ToListAsync();
        return data;
    }

    public async Task<OperationResult<List<FunctionVM>>> GetParentIdsAsync()
    {
        IQueryable<Function>? query = _repoStore.Functions.FindAll(true);
        List<FunctionVM>? listFunctionVM = await query.Select(x => new FunctionVM()
        {
            Id = x.Id,
            Name = x.Name,
            ParentId = x.ParentId,
            SortOrder = x.SortOrder,
            Icon = x.Icon
        }).ToListAsync();
        return OperationResult<List<FunctionVM>>.Success(listFunctionVM, "Get Parent successfully.");
    }

    public async Task<OperationResult<PagingResult<FunctionVM>>> GetPagingAsync(string? filter, PaginationParam pagination)
    {
        IQueryable<Function>? query = _repoStore.Functions.FindAll(true);
        if (!string.IsNullOrWhiteSpace(filter))
        {
            query = query.Where(x => x.Id.Contains(filter) || x.Name.Contains(filter));
        }
        List<FunctionVM>? listFunctionVM = await query.Select(x => new FunctionVM()
        {
            Id = x.Id,
            Name = x.Name,
            Url = x.Url,
            ParentId = x.ParentId,
            SortOrder = x.SortOrder,
            Icon = x.Icon
        }).ToListAsync();
        PagingResult<FunctionVM>? resultPaging = PagingResult<FunctionVM>.Create(listFunctionVM, pagination.PageNumber, pagination.PageSize);
        return OperationResult<PagingResult<FunctionVM>>.Success(resultPaging, "Get function successfully.");
    }

    public async Task<OperationResult<string>> PutAsync(string id, FunctionCreateRequest request)
    {
        Function? function = await _repoStore.Functions.FindByIdAsync(id);
        if (function is null || function.Id != request.Id)
            return OperationResult<string>.NotFound("Function not found.");
        function.Name = request.Name;
        function.ParentId = request.ParentId;
        function.SortOrder = request.SortOrder;
        function.Url = request.Url;
        function.Icon = request.Icon;
        _repoStore.Functions.Update(function);
        bool result = await _repoStore.SaveChangesAsync();
        if (result)
            return OperationResult<string>.Success(function.Id, "Function updated successfully.");

        return OperationResult<string>.BadRequest("Function update failed.");
    }

    public async Task<OperationResult<string>> DeleteAsync(string id)
    {
        Function? function = await _repoStore.Functions.FindByIdAsync(id);
        if (function is null)
            return OperationResult<string>.NotFound("Function not found.");
        // Kiểm tra xem function có child functions hay không.
        List<Function>? childFunctions = await _repoStore.Functions.FindAll(x => x.ParentId == id).ToListAsync();
        if (childFunctions.Count > 0)
            return OperationResult<string>.BadRequest("Cannot delete function with children. Please delete children first");
        _repoStore.Functions.Remove(function);
        // remove command in function
        List<CommandInFunction>? commands = await _repoStore.CommandInFunctions.FindAll(x => x.FunctionId == id).ToListAsync();
        if (commands.Count > 0)
            _repoStore.CommandInFunctions.RemoveMany(commands);

        bool result = await _repoStore.SaveChangesAsync();
        if (result)
            return OperationResult<string>.Success(function.Id, "Function deleted successfully.");
        return OperationResult<string>.BadRequest("Function delete failed.");
    }

    public async Task<OperationResult> DeleteRangeAsync(List<string> ids)
    {
        if (ids.Count == 0) return OperationResult.NotFound("List function not found.");

        // Lấy ra danh sách các functions cần xoá.
        var functionsToDelete = await _repoStore.Functions.FindAll(entity => ids.Contains(entity.Id)).ToListAsync();
        if (functionsToDelete.Count == 0)
            return OperationResult.NotFound("List function empty.");

        // Kiểm tra xem các functions này có child functions không.
        foreach (var function in functionsToDelete)
        {
            List<Function>? childFunctions = await _repoStore.Functions.FindAll(x => x.ParentId == function.Id).ToListAsync();
            if (childFunctions.Count != 0)
            {
                // Nếu tồn tại child functions, trả về lỗi và không xóa.
                return OperationResult.BadRequest($"Function {function.Id} has child functions. Please delete child functions first.");
            }
            // remove command in function
            List<CommandInFunction>? commands = await _repoStore.CommandInFunctions.FindAll(x => x.FunctionId == function.Id).ToListAsync();
            if (commands.Count > 0)
                _repoStore.CommandInFunctions.RemoveMany(commands);
        }

        // Xóa các functions không có child functions.
        _repoStore.Functions.RemoveMany(functionsToDelete);

        // Có thể thêm logic xóa các `CommandInFunction` liên quan tại đây nếu cần.

        bool result = await _repoStore.SaveChangesAsync();
        if (!result)
        {
            return OperationResult.BadRequest("Failed to delete functions.");
        }

        return OperationResult.Success("Functions deleted successfully.");
    }

}
