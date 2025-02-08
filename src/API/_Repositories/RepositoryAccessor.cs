using API.Data;
using API.Models;
using API.Models.Common;
using Microsoft.EntityFrameworkCore.Storage;
namespace API._Repositories
{
    public class RepositoryAccessor : IRepositoryAccessor
    {
        private readonly DataContext _dbContext;

        public RepositoryAccessor(DataContext dbContext)
        {
            _dbContext = dbContext;
            Functions = new Repository<Function, DataContext>(_dbContext);
            CommandInFunctions = new Repository<CommandInFunction, DataContext>(_dbContext);
            Commands = new Repository<Command, DataContext>(_dbContext);
            Permissions = new Repository<Permission, DataContext>(_dbContext);
            Users = new Repository<User, DataContext>(_dbContext);
            RefreshTokens = new Repository<RefreshToken, DataContext>(_dbContext);
            SystemLanguages = new Repository<SystemLanguage, DataContext>(_dbContext);
            Customers = new Repository<Customer, DataContext>(_dbContext);
            Orders = new Repository<Order, DataContext>(_dbContext);
            OrderDetails = new Repository<OrderDetail, DataContext>(_dbContext);
            Products = new Repository<Product, DataContext>(_dbContext);
        }

        public IRepository<User> Users { get; set; } = default!;
        public IRepository<Command> Commands { get; set; } = default!;

        public IRepository<CommandInFunction> CommandInFunctions { get; set; } = default!;

        public IRepository<Function> Functions { get; set; } = default!;

        public IRepository<Permission> Permissions { get; set; } = default!;

        public IRepository<RefreshToken> RefreshTokens { get; set; } = default!;

        public IRepository<SystemLanguage> SystemLanguages { get; set; } = default!;

        public IRepository<Customer> Customers { get; set; } = default!;

        public IRepository<Order> Orders { get; set; } = default!;

        public IRepository<OrderDetail> OrderDetails { get; set; } = default!;

        public IRepository<Product> Products { get; set; } = default!;

        public async Task<bool> SaveChangesAsync()
        {
            return await _dbContext.SaveChangesAsync() > 0;
        }

        public bool SaveChanges()
        {
            return _dbContext.SaveChanges() > 0;
        }

        public async Task<IDbContextTransaction> BeginTransactionAsync()
        {
            return await _dbContext.Database.BeginTransactionAsync();
        }
    }
}