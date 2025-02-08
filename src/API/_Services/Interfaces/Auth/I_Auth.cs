using API.Dtos.Auth;
using API.Helpers.Base;
using static API.Configurations.DependencyInjectionConfig;

namespace API._Services.Interfaces.Auth;

[DependencyInjection(ServiceLifetime.Scoped)]
public interface I_Auth
{
    Task<OperationResult<AuthResponse>> LoginAsync(LoginRequest request);
    Task<OperationResult<AuthResponse>> RefreshTokenAsync(TokenRequest request);
    Task<OperationResult> Revoke(string username);
}
