using System.Security.Claims;
using API.Helpers.Base;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BaseController : ControllerBase
{
    protected string IdLogedIn => User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "";
    protected string UserNameLogedIn => User.FindFirst(ClaimTypes.Name)?.Value ?? "";
    protected IActionResult HandleResult<T>(OperationResult<T> result)
    {
        if (!result.Succeeded)
        {
            return HandleStatusCode(result.StatusCode, result);
        }
        return Ok(result);
    }

    protected IActionResult HandleResult(OperationResult result)
    {
        if (!result.Succeeded)
        {
            return HandleStatusCode(result.StatusCode, result);
        }
        return Ok(result);
    }

    private IActionResult HandleStatusCode(int statusCode, object result)
    {
        return statusCode switch
        {
            401 => Unauthorized(),
            403 => Forbid(),
            404 => NotFound(result),
            409 => Conflict(result),
            _ => BadRequest(result),
        };
    }
}