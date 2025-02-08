using API.Models.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
namespace API.Seeds;

public class SystemLanguageSeed : IEntityTypeConfiguration<SystemLanguage>
{
    public void Configure(EntityTypeBuilder<SystemLanguage> builder)
    {
        builder.HasData(
            new SystemLanguage
            {
                Id = "en_US",
                Name = "English",
                UrlImage = "en.png"
            },
            new SystemLanguage
            {
                Id = "vi_VN",
                Name = "Vietnamese",
                UrlImage = "vn.png"
            },
            new SystemLanguage
            {
                Id = "zh_TW",
                Name = "繁體中文",
                UrlImage = "zh.png"
            }
        );
    }
}
