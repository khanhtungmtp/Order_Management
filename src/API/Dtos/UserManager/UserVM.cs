namespace API.Dtos.UserManager;

public class UserVM
{
    public string Id { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public Gender Gender { get; set; }
    public bool IsActive { get; set; }
    public DateTime DateOfBirth { get; set; }
    public List<string> Roles { get; set; } = [];
    public DateTime? UpdatedDate { get; set; }
}

public enum Gender
{
    Male,
    Female
}
