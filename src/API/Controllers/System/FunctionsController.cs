using API._Services.Interfaces.System;
using API.Dtos.System;
using API.Filters.Authorization;
using API.Helpers.Base;
using API.Helpers.Constants;
using API.Helpers.Utilities;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.System;

[ApiController]
[Route("api/[controller]")]
public class FunctionsController(I_Function functionService, I_CommandInFunction commandInFunctionService) : BaseController
{
    private readonly I_Function _functionService = functionService;
    private readonly I_CommandInFunction _commandInFunctionService = commandInFunctionService;

    // url: POST : http://localhost:6001/api/function
    [HttpPost]
    [ClaimRequirement(FunctionCode.SYSTEM_FUNCTION, CommandCode.CREATE)]
    public async Task<IActionResult> PostFunction(FunctionCreateRequest request)
    {
        OperationResult<string>? result = await _functionService.CreateAsync(request);
        return HandleResult(result);
    }

    // url: GET : http:localhost:6001/api/functions/parentids
    [HttpGet("parentids")]
    [ClaimRequirement(FunctionCode.SYSTEM_FUNCTION, CommandCode.VIEW)]
    public async Task<IActionResult> GetParentIdsAsync()
    {
        return Ok(await _functionService.GetParentIdsAsync());
    }

    // url: GET : http:localhost:6001/api/functions
    [HttpGet]
    [ClaimRequirement(FunctionCode.SYSTEM_FUNCTION, CommandCode.VIEW)]
    public async Task<IActionResult> GetAllPaging(string? filter, [FromQuery] PaginationParam pagination)
    {
        filter ??= string.Empty;
        return Ok(await _functionService.GetPagingAsync(filter, pagination));
    }

    // url: GET : http:localhost:6001/api/function/{id}
    [HttpGet("{id}")]
    [ClaimRequirement(FunctionCode.SYSTEM_FUNCTION, CommandCode.VIEW)]
    public async Task<IActionResult> GetById(string id)
    {
        OperationResult<FunctionVM>? result = await _functionService.FindByIdAsync(id);
        return HandleResult(result);
    }

    // url: PUT : http:localhost:6001/api/function/{id}
    [HttpPut("{id}")]
    [ClaimRequirement(FunctionCode.SYSTEM_FUNCTION, CommandCode.UPDATE)]
    public async Task<IActionResult> PutFunction(string id, [FromBody] FunctionCreateRequest request)
    {
        OperationResult<string>? result = await _functionService.PutAsync(id, request);
        return HandleResult(result);
    }

    // url: DELETE : http:localhost:6001/api/function/{id}
    [HttpDelete("{id}")]
    [ClaimRequirement(FunctionCode.SYSTEM_FUNCTION, CommandCode.DELETE)]
    public async Task<IActionResult> DeleteFunction(string id)
    {
        OperationResult<string>? result = await _functionService.DeleteAsync(id);
        return HandleResult(result);
    }

    // url: DELETE : http:localhost:6001/api/function/{ids}
    [HttpDelete("DeleteRangeFunction")]
    [ClaimRequirement(FunctionCode.SYSTEM_FUNCTION, CommandCode.DELETE)]
    public async Task<IActionResult> DeleteRangeFunction([FromBody] List<string> ids)
    {
        OperationResult? result = await _functionService.DeleteRangeAsync(ids);
        return HandleResult(result);
    }

    // ========AREA COMMMAND IN FUNCTION (ACTION)=====
    // GET: http://localhost:6001/api/function/GetCommands
    [HttpGet("commands")]
    [ClaimRequirement(FunctionCode.SYSTEM_FUNCTION, CommandCode.VIEW)]
    public async Task<IActionResult> GetCommands()
    {
        OperationResult<List<CommandVM>>? result = await _commandInFunctionService.GetCommandsAsync();
        return HandleResult(result);
    }

    // PostCommandToFunction
    // POST: http://localhost:6001/api/function/{functionId}/commands
    [HttpPost("{functionId}/commands")]
    [ClaimRequirement(FunctionCode.SYSTEM_FUNCTION, CommandCode.CREATE)]
    public async Task<IActionResult> PostCommandToFunction(string functionId, [FromBody] CommandAssignRequest request)
    {
        OperationResult<CommandInFunctionResponseVM>? result = await _commandInFunctionService.CreateAsync(functionId, request);
        if (!result.Succeeded || result.Data is null)
        {
            if (result.StatusCode == 404)
                return NotFound(result);
            else
                return BadRequest(result);
        }
        return CreatedAtAction(nameof(GetById), new CommandInFunctionResponseVM() { CommandIds = result.Data.CommandIds, FunctionId = result.Data.FunctionId }, request);
    }

    //DeleteCommandToFunction
    // DELETE: http://localhost:6001/api/function/{functionId}/commands
    [HttpDelete("{functionId}/commands")]
    [ClaimRequirement(FunctionCode.SYSTEM_FUNCTION, CommandCode.DELETE)]
    public async Task<IActionResult> DeleteCommandToFunction(string functionId, [FromBody] CommandAssignRequest request)
    {
        OperationResult? result = await _commandInFunctionService.DeleteAsync(functionId, request);
        return HandleResult(result);
    }

}
