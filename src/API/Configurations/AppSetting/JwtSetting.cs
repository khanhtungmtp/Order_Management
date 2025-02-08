namespace API.Configurations.AppSetting;

public class JwtSetting
{
    public string SecurityKey { get; set; } = string.Empty;

    public string ValidAudience { get; set; } = string.Empty;

    public string ValidIssuer { get; set; } = string.Empty;

    public string ExpireInMinutes { get; set; } = string.Empty;

    public string RefreshTokenValidityInDays { get; set; } = string.Empty;

}
