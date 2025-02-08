using API.Models;
using API.Models.Common;
using API.Models.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace API.Data;

public class DataContext(DbContextOptions options) : IdentityDbContext<User>(options)
{

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        IEnumerable<EntityEntry> modified = ChangeTracker.Entries()
            .Where(e => e.State == EntityState.Modified || e.State == EntityState.Added);
        foreach (EntityEntry item in modified)
        {
            if (item.Entity is IDateTracking changedOrAddedItem)
            {
                if (item.State == EntityState.Added)
                {
                    changedOrAddedItem.CreatedDate = DateTime.Now;
                }
                else
                {
                    changedOrAddedItem.UpdatedDate = DateTime.Now;
                }
            }
        }
        return base.SaveChangesAsync(cancellationToken);
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<IdentityRole>().Property(x => x.Id).HasMaxLength(50).IsUnicode(false);
        builder.Entity<User>().Property(x => x.Id).HasMaxLength(50).IsUnicode(false);

        builder.Entity<Permission>()
                   .HasKey(c => new { c.RoleId, c.FunctionId, c.CommandId });

        builder.Entity<CommandInFunction>()
                   .HasKey(c => new { c.CommandId, c.FunctionId });

        builder.HasSequence("Forumsequence");

        builder.Entity<OrderDetail>()
            .HasOne(od => od.Order)
            .WithMany(o => o.OrderDetails)
            .HasForeignKey(od => od.OrderId);

        builder.Entity<OrderDetail>()
            .HasOne(od => od.Product)
            .WithMany()
            .HasForeignKey(od => od.ProductId);
    }

    public DbSet<Command> Commands => Set<Command>();
    public DbSet<CommandInFunction> CommandInFunctions => Set<CommandInFunction>();
    public DbSet<Function> Functions => Set<Function>();
    public DbSet<Permission> Permissions => Set<Permission>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<SystemLanguage> SystemLanguages => Set<SystemLanguage>();
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderDetail> OrderDetails => Set<OrderDetail>();
}
