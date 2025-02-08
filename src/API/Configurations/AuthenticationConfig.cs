using System.Text;
using API.Data;
using API.Models.Common;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
namespace API.Configurations;
public static class AuthenticationConfig
{
    public static void AddAuthenticationConfigufation(this IServiceCollection services, IConfiguration configuration)
    {
        // These will eventually be moved to a secrets file, but for alpha development appsettings is fine
        var JWTSetting = configuration.GetSection("JWTSetting");
        // add autentication
        services.AddAuthentication(opt =>
        {
            opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            opt.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        // .AddCookie(x =>
        // {
        //     x.Cookie.Name = "token";
        // })
        .AddJwtBearer(opt =>
        {
            opt.SaveToken = true;
            opt.RequireHttpsMetadata = false;
            opt.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JWTSetting.GetSection("securityKey").Value!)),
                // Allow to use seconds for expiration of token
                // Required only when token lifetime less than 5 minutes
                // THIS ONE
                ClockSkew = TimeSpan.Zero,
            };
            // lắng nghe khi authen failed
            opt.Events = new JwtBearerEvents
            {
                OnAuthenticationFailed = context =>
                {
                    if (context.Exception.GetType() == typeof(SecurityTokenExpiredException))
                    {
                        context.Response.Headers.Append("Token-Expired", "true");
                    }
                    return Task.CompletedTask;
                },
                // OnMessageReceived = context =>
                // {
                //     context.Token = context.Request.Cookies["token"];
                //     return Task.CompletedTask;
                // }
            };
        });
        services.AddAuthorization();

        //2. Setup idetntity
        services.AddIdentityCore<User>()
           .AddRoles<IdentityRole>() // Nếu bạn muốn sử dụng Roles
           .AddEntityFrameworkStores<DataContext>() // Set up EF stores
           .AddSignInManager<SignInManager<User>>() // Thêm SignInManager nếu bạn cần nó
           .AddDefaultTokenProviders(); // Thêm token providers nếu bạn muốn sử dụng function như là đặt lại mật khẩu

        services.Configure<IdentityOptions>(options =>
        {
            // Default Lockout settings.
            options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
            options.Lockout.MaxFailedAccessAttempts = 5;
            options.Lockout.AllowedForNewUsers = true;
            options.SignIn.RequireConfirmedPhoneNumber = false;
            options.SignIn.RequireConfirmedAccount = false;
            options.SignIn.RequireConfirmedEmail = false;
            options.Password.RequiredLength = 8;
            options.Password.RequireDigit = true;
            options.Password.RequireUppercase = true;
            options.User.RequireUniqueEmail = true;
        });
    }
}