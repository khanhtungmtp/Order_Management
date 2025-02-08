namespace API.Dtos.UserManager;

public class UserCreateRequest
{
    public string UserName { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public int Gender { get; set; }
    public bool IsActive { get; set; }
    public DateTime DateOfBirth { get; set; }
    public List<string>? Roles { get; set; }
}
