using Serilog;

namespace API.Data;

public static class DataSeeder
{
    public static void SeedDatabase(IHost app)
    {
        using IServiceScope? scope = app.Services.CreateScope();
        string? logPath = Path.Combine(Directory.GetCurrentDirectory(), "logs");
        if (!Directory.Exists(logPath))
        {
            Directory.CreateDirectory(logPath);
        }
        try
        {
            IServiceProvider? services = scope.ServiceProvider;
            DbInitializer? dbInitializer = services.GetRequiredService<DbInitializer>();
            dbInitializer.Seed().Wait();
        }
        catch (Exception ex)
        {
            Log.Error(ex, "DataSeeder error: {Message}", ex.Message);
        }
    }
}
