using System.Net;
using API.Configurations;
using API.Configurations.AppSetting;
using API.Data;
using API.Dtos.UserManager.Validator;
using API.Helpers.Base;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Serilog;
using Serilog.Exceptions;
try
{
    var builder = WebApplication.CreateBuilder(args);
    Log.Logger = new LoggerConfiguration()
                    .ReadFrom.Configuration(builder.Configuration)
                    .Enrich.WithExceptionDetails()
                    .CreateLogger();
    builder.Host.UseSerilog(Log.Logger);
    builder.Services.AddCors();
    // Add services to the container.
    builder.Services.Configure<AppSetting>(builder.Configuration.GetSection("AppSettings"));
    builder.Services.Configure<JwtSetting>(builder.Configuration.GetSection("JWTSetting"));
    // redirect fluent validation exceptions to the global error handler
    builder.Services.AddControllers().ConfigureApiBehaviorOptions(options =>
     options.InvalidModelStateResponseFactory = actionContext =>
     {
         var context = actionContext.HttpContext;
         string? trackId = Guid.NewGuid().ToString();
         context.Response.Headers.Append("TrackId", trackId); // add TrackId to header response

         var modelState = actionContext.ModelState.Values;
         var errors = modelState.SelectMany(x => x.Errors).Select(x => x.ErrorMessage);
         var objectError = new ErrorGlobalResponse
         {
             TrackId = trackId,
             StatusCode = (int)HttpStatusCode.BadRequest,
             Type = "ValidatorError",
             Message = ReasonPhrases.GetReasonPhrase((int)HttpStatusCode.BadRequest),
             Errors = errors,
             Instance = $"{context.Request.Method} {context.Request.Path}",
         };
         // Logging the objectError with Serilog
         Log.Error("Validation error on request {TrackId}: {ObjectError}", trackId, objectError);

         return new BadRequestObjectResult(objectError);

     }).AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
    });
    builder.Services.AddFluentValidationAutoValidation();
    builder.Services.AddFluentValidationClientsideAdapters();
    builder.Services.AddValidatorsFromAssemblyContaining<RoleVmValidator>();
    // Setting DBContexts
    builder.Services.AddDatabaseConfiguration(builder.Configuration);

    // Add Authentication
    builder.Services.AddAuthenticationConfigufation(builder.Configuration);

    // RepositoryAccessor and Service
    builder.Services.AddDependencyInjectionConfiguration(typeof(Program));
    builder.Services.AddTransient<DbInitializer>();
    // Swagger Config
    builder.Services.AddSwaggerGenConfiguration();
    // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
    builder.Services.AddEndpointsApiExplorer();
    if (builder.Environment.IsDevelopment())
    {
        builder.Services.AddSwaggerGen();
    }
    builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
    builder.Services.AddProblemDetails();
    var app = builder.Build();

    // Configure the HTTP request pipeline.
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }
    app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
    app.UseHttpsRedirection();
    app.UseRouting();
    app.UseStaticFiles();
    app.UseAuthentication();
    app.UseAuthorization();
    app.MapControllers();
    app.UseExceptionHandler();
    // app.UseMiddleware<JwtMiddleware>();
    // seeding inittial Data
    DataSeeder.SeedDatabase(app);
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Unhandled exception");
}
finally
{
    Log.Information("Shut down complete");
    Log.CloseAndFlush();
}
