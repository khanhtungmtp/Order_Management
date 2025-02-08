using API.Models;
using API.Models.Common;
using Microsoft.EntityFrameworkCore.Storage;
using static API.Configurations.DependencyInjectionConfig;
namespace API._Repositories
{
    [DependencyInjection(ServiceLifetime.Scoped)]
    public interface IRepositoryAccessor
    {
        Task<bool> SaveChangesAsync();
        bool SaveChanges();
        Task<IDbContextTransaction> BeginTransactionAsync();
        IRepository<User> Users { get; }
        IRepository<Command> Commands { get; }
        IRepository<CommandInFunction> CommandInFunctions { get; }
        IRepository<Function> Functions { get; }
        IRepository<Permission> Permissions { get; }
        IRepository<SystemLanguage> SystemLanguages { get; }
        IRepository<RefreshToken> RefreshTokens { get; }
        IRepository<Customer> Customers { get; }
        IRepository<Order> Orders { get; }
        IRepository<OrderDetail> OrderDetails { get; }
        IRepository<Product> Products { get; }
    }
}