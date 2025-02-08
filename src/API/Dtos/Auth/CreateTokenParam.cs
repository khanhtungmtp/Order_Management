namespace API.Dtos.Auth;

public class CreateTokenParam
{
    public string Id { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public List<string> Permissions { get; set; } = [];
}
