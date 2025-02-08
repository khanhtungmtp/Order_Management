namespace API.Dtos.Auth;

public class RefreshTokenVM
{

    public int Id { get; set; }
    public int UserId { get; set; }

    public string Token { get; set; } = string.Empty;
    public string JwtId { get; set; } = string.Empty;
    public bool IsUsed { get; set; }
    public bool IsRevoked { get; set; }
    public DateTime IssuedAt { get; set; }
    public DateTime ExpiredAt { get; set; }
}
