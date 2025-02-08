using API._Repositories;
using API._Services.Interfaces.System;
using API.Dtos.System;
using API.Helpers.Base;
using API.Models.Common;
using Microsoft.EntityFrameworkCore;

namespace API._Services.Services.System;
public class S_CommandInFunction(IRepositoryAccessor repoStore) : BaseServices(repoStore), I_CommandInFunction
{
    public async Task<OperationResult<List<CommandVM>>> GetCommandsAsync()
    {
        var data = await _repoStore.Commands.FindAll(true).Select(x => new CommandVM()
        {
            Id = x.Id,
            Name = x.Name
        }).ToListAsync();
        return OperationResult<List<CommandVM>>.Success(data, "Get command successfully.");
    }

    // PostCommandInFunction
    public async Task<OperationResult<CommandInFunctionResponseVM>> CreateAsync(string functionId, CommandAssignRequest request)
    {
        foreach (string commandId in request.CommandIds)
        {
            if (await _repoStore.CommandInFunctions.FindAsync(commandId, functionId) is not null)
                return OperationResult<CommandInFunctionResponseVM>.Conflict($"Command {commandId} already exists in function.");

            CommandInFunction? entity = new()
            {
                CommandId = commandId,
                FunctionId = functionId
            };

            _repoStore.CommandInFunctions.Add(entity);
        }

        if (request.AddToAllFunctions)
        {
            IQueryable<Function>? otherFunctions = _repoStore.Functions.FindAll(x => x.Id != functionId);
            foreach (Function function in otherFunctions)
            {
                foreach (string? commandId in request.CommandIds)
                {
                    if (await _repoStore.CommandInFunctions.FindAsync(request.CommandIds, function.Id) is null)
                    {
                        _repoStore.CommandInFunctions.Add(new CommandInFunction()
                        {
                            CommandId = commandId,
                            FunctionId = function.Id
                        });
                    }
                }
            }
        }
        bool result = await _repoStore.SaveChangesAsync();

        if (result)
            return OperationResult<CommandInFunctionResponseVM>.Success(new CommandInFunctionResponseVM() { CommandIds = request.CommandIds, FunctionId = functionId }, "Add command to function successfully.");
        else
            return OperationResult<CommandInFunctionResponseVM>.BadRequest("Add command to function failed.");
    }

    public async Task<OperationResult> DeleteAsync(string functionId, CommandAssignRequest request)
    {
        foreach (string commandId in request.CommandIds)
        {
            CommandInFunction? entity = await _repoStore.CommandInFunctions.FindAsync(commandId, functionId);
            if (entity is null)
                return OperationResult.NotFound($"This command {commandId} is not existed in function");

            _repoStore.CommandInFunctions.Remove(entity);
        }

        bool result = await _repoStore.SaveChangesAsync();

        if (result)
            return OperationResult.Success("Command to function delete successfully.");
        else
            return OperationResult.BadRequest("Delete command to function failed.");

    }
}
