using API.Data;
using Microsoft.EntityFrameworkCore;

namespace API.Configurations
{
    public static class DatabaseConfig
    {
        public static void AddDatabaseConfiguration(this IServiceCollection services, IConfiguration configuration)
        {
            var area = configuration.GetSection("AppSettings:Area").Value;
            string? ConnectionString = configuration.GetConnectionString($"DefaultConnection_{area}");
            services.AddDbContext<DataContext>(options =>
            {
                options.UseSqlServer(ConnectionString);
                options.EnableSensitiveDataLogging(true);
            }
            );

            services.AddDistributedSqlServerCache(o =>
           {
               o.ConnectionString = ConnectionString;
               o.SchemaName = "dbo";
               o.TableName = "CacheTable";
           });
        }
    }
}