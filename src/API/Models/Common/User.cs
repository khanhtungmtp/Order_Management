using API.Models.Interfaces;
using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using static API.Helpers.Constants.SystemConstants;
namespace API.Models.Common;
public class User : IdentityUser, IDateTracking
{
    public User() { }

    public User(string id, string userName, string fullName, string email, string phoneNumber, DateTime dateOfBirth)
    {
        Id = id;
        UserName = userName;
        FullName = fullName;
        Email = email;
        PhoneNumber = phoneNumber;
        DateOfBirth = dateOfBirth;
    }
    [MaxLength(50)]
    [Required]
    public string FullName { get; set; } = string.Empty;

    [Required]
    public DateTime DateOfBirth { get; set; }

    public int? NumberOfForums { get; set; }

    public int? NumberOfVotes { get; set; }

    public int? NumberOfReports { get; set; }
    public Gender Gender { get; set; } // 0, male (nam), 1, female
    public bool IsActive { get; set; }
    public DateTime LastLoginTime { get; set; }
    public string? RefreshToken { get; set; }
    public DateTime RefreshTokenExpiryTime { get; set; }
    public string? CreatedBy { get; set; }
    public string? UpdatedBy { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime UpdatedDate { get; set; }
}
