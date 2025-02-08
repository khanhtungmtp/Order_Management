namespace API.Dtos.UserManager;

public class UserSearchRequest
{
    public string? UserName { get; set; }
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
    public string? FullName { get; set; }
    public Gender? Gender { get; set; } // 0 nam, 1 nữ
    public bool? IsActive { get; set; }
    public string? DateOfBirth { get; set; }
}
