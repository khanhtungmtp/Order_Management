using System.Net;
using Microsoft.AspNetCore.Diagnostics;
using Serilog;

namespace API.Helpers.Base;

public class GlobalExceptionHandler(IHostEnvironment env) : IExceptionHandler
{
    private readonly IHostEnvironment _env = env;

    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception ex, CancellationToken cancellationToken)
    {
        ErrorGlobalResponse? result;
        string? detail = _env.IsDevelopment() ? ex.StackTrace?.ToString() : "Sorry, there is an error on server."; // show only development
        string? message = _env.IsDevelopment() && ex.GetType().Name == "SqlException" ? ex.Message?.ToString() : "Sorry, there is an error on server."; // show only development

        result = new ErrorGlobalResponse
        {
            TrackId = Guid.NewGuid().ToString(),
            StatusCode = (int)(HttpStatusCode)httpContext.Response.StatusCode,
            Type = ex.GetType().Name,
            Message = message,
            Detail = detail,
            Instance = $"{httpContext.Request.Method} {httpContext.Request.Path}",
        };

        // Logging the exception with Serilog
        Log.Error(ex, "GlobalExceptionHandler error: {Message}", ex.Message);
        if (httpContext.Response.StatusCode == (int)HttpStatusCode.BadRequest)
        {
            var badObjectResult = httpContext.Features.Get<IExceptionHandlerFeature>()?.Error;
            if (badObjectResult != null)
            {
                // Ghi log chi tiết lỗi từ BadObjectResult, thí dụ như content của nó
                Log.Error("A bad request occurred: {Error} with content: {Content}",
                            ex.Message, badObjectResult.ToString());
            }
        }
        // Write the response
        if (httpContext is not null)
        {
            httpContext.Response.StatusCode = result.StatusCode;
            await httpContext.Response.WriteAsJsonAsync(result, cancellationToken: cancellationToken);
            return true;
        }
        return false;
    }
}
