using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using API._Repositories;
using API._Services.Interfaces.Auth;
using API.Configurations.AppSetting;
using API.Data;
using API.Dtos.Auth;
using API.Helpers.Base;
using API.Models.Common;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace API._Services.Services.Auth;

public class S_Auth : BaseServices, I_Auth
{
    private readonly UserManager<User> _userManager;
    private readonly IOptions<JwtSetting> _jwtSettings;
    private readonly DataContext _context;

    public S_Auth(IRepositoryAccessor repoStore, UserManager<User> userManager, SignInManager<User> signInManager
    , IOptions<JwtSetting> jwtSettings, DataContext context) : base(repoStore)
    {
        _userManager = userManager;
        _jwtSettings = jwtSettings;
        _context = context;
    }

    public async Task<OperationResult<AuthResponse>> LoginAsync(LoginRequest request)
    {
        User? user = _repoStore.Users.FirstOrDefault(u => u.UserName == request.UserName);

        if (user is null)
            return OperationResult<AuthResponse>.Success(new AuthResponse(),"Wrong username or password");

        bool isPasswordValid = await _userManager.CheckPasswordAsync(user, request.Password);

        if (!isPasswordValid)
           return OperationResult<AuthResponse>.Success(new AuthResponse(),"Wrong username or password");

        string? token = GenerateToken(user);
        string? refreshToken = GenerateRefreshToken();
        _ = int.TryParse(_jwtSettings.Value.RefreshTokenValidityInDays, out int RefreshTokenValidityIn);
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(RefreshTokenValidityIn);
        await _userManager.UpdateAsync(user);
        // get permission for command
        /*
        SELECT P.FunctionId, P.CommandId 
        FROM dbo.AspNetUsers AS U
        JOIN dbo.AspNetUserRoles AS UR ON U.Id = UR.UserId
        JOIN dbo.AspNetRoles AS R ON UR.RoleId = R.Id 
        JOIN dbo.Permissions AS P ON R.Id = P.RoleId 
        WHERE U.Id = 'your-user-id';
        */
        // Assuming there is a navigation property in your context or user model to access Role entities directly
        List<string>? roleIds = [.. _context.UserRoles
            .Where(ur => ur.UserId == user.Id)
            .Select(ur => ur.RoleId)];

        // Get permissions based on those roleIds
        List<string>? permissions = [.. _repoStore.Permissions
            .FindAll(p => roleIds.Contains(p.RoleId))
            .Select(p => $"{p.FunctionId}:{p.CommandId}")];
        AuthResponse? res = new()
        {
            Id = user.Id,
            Username = user.UserName ?? string.Empty,
            Email = user.Email,
            Permissions = permissions,
            Token = token,
            RefreshToken = refreshToken
        };
        return OperationResult<AuthResponse>.Success(res, "Login successfully");
    }

    public async Task<OperationResult<AuthResponse>> RefreshTokenAsync(TokenRequest request)
    {
        var principal = GetPrincipalFromExpiredToken(request.Token);
        User? user = await _userManager.FindByEmailAsync(request.Email);

        if (principal is null || user is null || user.RefreshToken != request.RefreshToken || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            return OperationResult<AuthResponse>.Forbidden("Token-Expired");

        string? newJwtToken = GenerateToken(user);
        string? newRefreshToken = GenerateRefreshToken();
        _ = int.TryParse(_jwtSettings.Value.RefreshTokenValidityInDays, out int RefreshTokenValidityInDays);

        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(RefreshTokenValidityInDays);

        await _userManager.UpdateAsync(user);
        return OperationResult<AuthResponse>.Success(new AuthResponse
        {
            Id = user.Id,
            Username = user.UserName ?? string.Empty,
            Email = user.Email,
            Token = newJwtToken,
            RefreshToken = newRefreshToken
        }, "Refresh token successfully");
    }

    public async Task<OperationResult> Revoke(string username)
    {
        User? user = _repoStore.Users.FirstOrDefault(u => u.UserName == username);

        if (user is null)
            return OperationResult.BadRequest("User not found");
        await _userManager.UpdateSecurityStampAsync(user);

        user.RefreshToken = null;
        user.RefreshTokenExpiryTime = DateTime.Now;
        _repoStore.SaveChanges();
        return OperationResult.Success("Token was successfully revoked");
    }

    #region private methods
    private static string GenerateRefreshToken()
    {
        byte[]? randomNumber = new byte[32];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
    }

    private string GenerateToken(User user)
    {
        JwtSecurityTokenHandler? tokenHandler = new();
        byte[]? key = Encoding.ASCII
        .GetBytes(_jwtSettings.Value.SecurityKey);

        Claim[]? claims =
            [
               new Claim(ClaimTypes.NameIdentifier, user.Id ?? ""),
               new Claim(ClaimTypes.Name, user.UserName ?? ""),
            ];
        _ = int.TryParse(_jwtSettings.Value.ExpireInMinutes, out int expireInMinutes);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(expireInMinutes),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        SecurityToken? token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);

    }

    private ClaimsPrincipal? GetPrincipalFromExpiredToken(string token)
    {
        TokenValidationParameters? tokenParameters = new()
        {
            ValidateAudience = false,
            ValidateIssuer = false,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Value.SecurityKey)),
            ValidateLifetime = false
        };

        JwtSecurityTokenHandler? tokenHandler = new();
        ClaimsPrincipal? principal = tokenHandler.ValidateToken(token, tokenParameters, out SecurityToken securityToken);

        if (securityToken is not JwtSecurityToken jwtSecurityToken || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
            throw new SecurityTokenException("Invalid token");

        return principal;
    }
    #endregion
}
