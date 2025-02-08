namespace API.Dtos.UserManager;

public class UserPasswordChangeRequest
{
    public string OldPassword { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}
