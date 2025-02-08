using API._Services.Interfaces.System;
using API.Dtos.System;
using API.Filters.Authorization;
using API.Helpers.Base;
using API.Helpers.Constants;
using API.Helpers.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.System;

public class SystemLanguagesController(I_SystemLanguage systemLanguageService) : BaseController
{
    private readonly I_SystemLanguage _systemLanguageService = systemLanguageService;

    // url: POST : http://localhost:6001/api/SystemLanguages
    [HttpPost]
    [ClaimRequirement(FunctionCode.SYSTEM_LANGUAGE, CommandCode.CREATE)]
    public async Task<IActionResult> PostLanguage(SystemLanguageCreateRequest request)
    {
        OperationResult? result = await _systemLanguageService.CreateAsync(request);
        return HandleResult(result);
    }

    // url: GET : http:localhost:6001/api/SystemLanguages/GetLanguages
    [HttpGet("list")]
    [AllowAnonymous]
    public async Task<IActionResult> GetLanguages()
    {
        return Ok(await _systemLanguageService.GetLanguagesAsync());
    }

    // url: GET : http:localhost:6001/api/SystemLanguages/list-paging
    [HttpGet("list-paging")]
    [AllowAnonymous]
    // [ClaimRequirement(FunctionCode.SYSTEM_LANGUAGE, CommandCode.VIEW)]
    public async Task<IActionResult> GetAllPaging(string? filter, [FromQuery] PaginationParam pagination)
    {
        filter ??= string.Empty;
        return Ok(await _systemLanguageService.GetPagingAsync(filter, pagination));
    }

    // url: GET : http:localhost:6001/api/SystemLanguages/{languageCode}
    [HttpGet("{languageCode}")]
    [ClaimRequirement(FunctionCode.SYSTEM_LANGUAGE, CommandCode.VIEW)]
    public async Task<IActionResult> GetById(string languageCode)
    {
        OperationResult<SystemLanguageVM>? result = await _systemLanguageService.FindByCodeAsync(languageCode);
        return HandleResult(result);
    }

    // url: PUT : http:localhost:6001/api/SystemLanguages/{id}
    [HttpPut("{languageCode}")]
    [ClaimRequirement(FunctionCode.SYSTEM_LANGUAGE, CommandCode.UPDATE)]
    public async Task<IActionResult> PutLanguage(string languageCode, [FromBody] SystemLanguageCreateRequest request)
    {
        OperationResult? result = await _systemLanguageService.PutAsync(languageCode, request);
        return HandleResult(result);
    }

    // PATCH api/users/{id}/status
    [HttpPatch("{languageCode}/UpdateStatus")]
    [ClaimRequirement(FunctionCode.SYSTEM_USER, CommandCode.UPDATE)]
    public async Task<IActionResult> UpdateStatus(string languageCode, [FromBody] bool isActive)
    {
        OperationResult? result = await _systemLanguageService.PatchStatusAsync(languageCode, isActive);
        return HandleResult(result);
    }

    // url: DELETE : http:localhost:6001/api/SystemLanguages/{id}
    [HttpDelete("{languageCode}")]
    [ClaimRequirement(FunctionCode.SYSTEM_LANGUAGE, CommandCode.DELETE)]
    public async Task<IActionResult> DeleteLanguage(string languageCode)
    {
        OperationResult<string>? result = await _systemLanguageService.DeleteAsync(languageCode);
        return HandleResult(result);
    }

}
