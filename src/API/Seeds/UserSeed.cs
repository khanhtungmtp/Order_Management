using API.Models.Common;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace API.Seeds;

public class UserSeed : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        var hasher = new PasswordHasher<User>();

        builder.HasData(
            new User
            {
                Id = Guid.NewGuid().ToString(),
                UserName = "admin",
                NormalizedUserName = "ADMIN",
                NormalizedEmail = "ADMIN@EXAMPLE.COM",
                EmailConfirmed = true,
                PasswordHash = hasher.HashPassword(null!, "@@Tung23"),
                DateOfBirth = new DateTime(1997, 01, 23),
                PhoneNumber = "0338716085",
                Email = "khanhtungmtp@gmail.com",
                LockoutEnabled = false
            }
            // You can seed more users here
        );
    }
}