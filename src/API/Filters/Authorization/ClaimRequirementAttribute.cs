using System.Net;
using System.Security.Claims;
using API.Data;
using API.Helpers.Base;
using API.Helpers.Constants;
using API.Models.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.WebUtilities;

namespace API.Filters.Authorization;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class ClaimRequirementAttribute(FunctionCode functionCode, CommandCode commandCode) : Attribute, IAuthorizationFilter
{
    private readonly FunctionCode _functionCode = functionCode;
    private readonly CommandCode _commandCode = commandCode;

    public void OnAuthorization(AuthorizationFilterContext context)
    {
        // skip authorization if action is decorated with [AllowAnonymous] attribute
        bool allowAnonymous = context.ActionDescriptor.EndpointMetadata.OfType<AllowAnonymousAttribute>().Any();
        if (allowAnonymous)
            return;
        HttpContext? httpContext = context.HttpContext;
        string? trackId = Guid.NewGuid().ToString();
        string? userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

        // authorization
        if (userId is null)
        {
            Unauthorize(context, trackId, httpContext, HttpStatusCode.Unauthorized);
            return;
        }

        // get roles where id 
        DataContext? _db = context.HttpContext.RequestServices.GetService(typeof(DataContext)) as DataContext;
        ArgumentNullException.ThrowIfNull(_db);
        // check refresh token
        var user = _db.Users.Select(x => new { x.Id, x.RefreshToken, x.RefreshTokenExpiryTime }).FirstOrDefault(x => x.Id == userId);
        if (user?.Id is null || user.RefreshToken is null || user.RefreshTokenExpiryTime < DateTime.UtcNow)
        {
            Unauthorize(context, trackId, httpContext, HttpStatusCode.Forbidden);
            return;
        }
        var userPermissions = GetUserPermissions(_db, userId, _functionCode, _commandCode);
        if (userPermissions == null)
        {
            Unauthorize(context, trackId, httpContext, HttpStatusCode.Forbidden);
        }

    }

    private static List<Permission> GetUserPermissions(DataContext context, string userId, FunctionCode functionCode, CommandCode commandCode)
    {
        List<string>? roleIds = context.UserRoles.Where(x => x.UserId == userId).Select(x => x.RoleId).ToList();

        return [.. context.Permissions.Where(p =>
            roleIds.Contains(p.RoleId) &&
            p.FunctionId == functionCode.ToString() &&
            p.CommandId == commandCode.ToString())];
    }

    private static void Unauthorize(AuthorizationFilterContext context, string trackId, HttpContext httpContext, HttpStatusCode statusCode)
    {
        context.Result = new ObjectResult(new ErrorGlobalResponse
        {
            TrackId = trackId,
            StatusCode = (int)statusCode,
            Message = ReasonPhrases.GetReasonPhrase((int)statusCode),
            Detail = $"Unauthorized, Access denied",
            Instance = $"{httpContext.Request.Method} {httpContext.Request.Path}"
        })
        {
            StatusCode = (int)statusCode
        };
    }
}