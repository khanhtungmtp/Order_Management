using API.Helpers.Enum;
using API.Models;
using API.Models.Common;
using Microsoft.AspNetCore.Identity;
using static API.Helpers.Constants.SystemConstants;
namespace API.Data;
public class DbInitializer(DataContext context,
  UserManager<User> userManager,
  RoleManager<IdentityRole> roleManager)
{
    private readonly DataContext _context = context;
    private readonly UserManager<User> _userManager = userManager;
    private readonly RoleManager<IdentityRole> _roleManager = roleManager;
    private readonly string AdminRoleName = "Admin";
    private readonly string UserRoleName = "Member";

    public async Task Seed()
    {
        #region Quyền

        if (!_roleManager.Roles.Any())
        {
            await _roleManager.CreateAsync(new IdentityRole
            {
                Id = AdminRoleName,
                Name = AdminRoleName,
                NormalizedName = AdminRoleName.ToUpper(),
            });
            await _roleManager.CreateAsync(new IdentityRole
            {
                Id = UserRoleName,
                Name = UserRoleName,
                NormalizedName = UserRoleName.ToUpper(),
            });
        }

        #endregion Quyền

        #region Người dùng
        // user
        var result1 = await _userManager.CreateAsync(new User
        {
            Id = Guid.NewGuid().ToString(),
            UserName = "member",
            FullName = "Thành viên",
            Gender = Gender.Male,
            IsActive = true,
            DateOfBirth = new DateTime(1995, 03, 15),
            PhoneNumber = "0987654321",
            Email = "thanhvien@gmail.com",
            LockoutEnabled = false
        }, "@@Tung23");
        if (result1.Succeeded)
        {
            User? user = await _userManager.FindByNameAsync("member");
            if (user != null)
                await _userManager.AddToRoleAsync(user, UserRoleName);
        }
        if (!_userManager.Users.Any())
        {
            var result = await _userManager.CreateAsync(new User
            {
                Id = Guid.NewGuid().ToString(),
                UserName = "admin",
                FullName = "Quản trị",
                Gender = Gender.Male,
                IsActive = true,
                DateOfBirth = new DateTime(1997, 01, 23),
                PhoneNumber = "0338716085",
                Email = "khanhtungmtp@gmail.com",
                LockoutEnabled = false
            }, "@@Tung23");
            if (result.Succeeded)
            {
                User? user = await _userManager.FindByNameAsync("admin");
                if (user != null)
                    await _userManager.AddToRoleAsync(user, AdminRoleName);
            }

        }

        #endregion Người dùng

        #region Chức năng

        if (!_context.Functions.Any())
        {
            _context.Functions.AddRange(new List<Function>
                {
                    new() {Id = "DASHBOARD", Name = "DASHBOARD", ParentId = "ROOT", SortOrder = 0,Url = "/admin/dashboard",Icon="dashboard"  },
                    new() {Id = "SYSTEM", Name = "Hệ thống", ParentId = "ROOT", SortOrder = 3,Url = "/system", Icon="setting" },
                    new() {Id = "SYSTEM_USER", Name = "Người dùng",ParentId = "SYSTEM",Url = "/admin/system/user-manager", Icon="usergroup-add"},
                    new() {Id = "SYSTEM_ROLE", Name = "Nhóm quyền",ParentId = "SYSTEM",Url = "/admin/system/role", Icon="team"},
                    new() {Id = "SYSTEM_FUNCTION", Name = "Chức năng",ParentId = "SYSTEM",Url = "/admin/system/function", Icon="folder-open"},
                    new() {Id = "SYSTEM_PERMISSION", Name = "Quyền hạn",ParentId = "SYSTEM",Url = "/admin/system/permission", Icon="unlock"},
                    new() {Id = "ORDER_MANAGEMENT", Name = "Quản lý đơn hàng",ParentId = "ROOT",Url = "/admin/order-management", Icon="unlock"},
                });
            await _context.SaveChangesAsync();
        }

        if (!_context.Commands.Any())
        {
            _context.Commands.AddRange(new List<Command>()
                {
                    new(){Id = "VIEW", Name = "Xem"},
                    new(){Id = "CREATE", Name = "Thêm"},
                    new(){Id = "UPDATE", Name = "Sửa"},
                    new(){Id = "DELETE", Name = "Xoá"},
                    new(){Id = "APPROVE", Name = "Duyệt"},
                });
        }

        #endregion Chức năng

        #region Sản phẩm
        if (!_context.Products.Any())
        {
            var products = new List<Product>
                {
                    new() { ProductName = "Iphone 16 128GB", Price = 15000000, StockQuantity = 10 },
                    new() { ProductName = "Iphone 16 256GB", Price = 18000000, StockQuantity = 20 },
                    new() { ProductName = "Iphone 16 Pro Max 512GB", Price = 30000000, StockQuantity = 15 },
                };

            _context.Products.AddRange(products);
            await _context.SaveChangesAsync();
        }
        #endregion

        #region Khách hàng
        if (!_context.Customers.Any())
        {
            var customers = new List<Customer>
                {
                    new() { FullName = "Mai Quý Đôn", Email = "mai.don@example.com", PhoneNumber = "0123456789", Address = "Daknong Lâm Đồng" },
                    new() { FullName = "Lê Minh Trí", Email = "lmtri97@example.com", PhoneNumber = "0987654321", Address = "An Giang" },
                    new() { FullName = "Nguyễn Khanh Tùng", Email = "khanhtungmtp@example.com", PhoneNumber = "0111222333", Address = "Bình Dương" }
                };

            _context.Customers.AddRange(customers);
            await _context.SaveChangesAsync();
        }
        #endregion

        #region Đơn hàng
        if (!_context.Orders.Any())
        {
            var customer = _context.Customers.FirstOrDefault();
            if (customer != null)
            {
                var orders = new List<Order>
                    {
                        new() { CustomerId = customer.CustomerId, OrderDate = DateTime.Now, TotalAmount = 16500000, Status = OrderStatus.Completed },
                        new() { CustomerId = customer.CustomerId, OrderDate = DateTime.Now, TotalAmount = 18500000, Status = OrderStatus.Pending },
                        new() { CustomerId = customer.CustomerId, OrderDate = DateTime.Now, TotalAmount = 22000000, Status = OrderStatus.Canceled }
                    };

                _context.Orders.AddRange(orders);
                await _context.SaveChangesAsync();

                var orderDetails = new List<OrderDetail>
                    {
                        new() { OrderId = orders[0].OrderId, ProductId = _context.Products.First().ProductId, Quantity = 1, SubTotal = 100 },
                        new() { OrderId = orders[1].OrderId, ProductId = _context.Products.Last().ProductId, Quantity = 2, SubTotal = 200 }
                    };

                _context.OrderDetails.AddRange(orderDetails);
                await _context.SaveChangesAsync();
            }
        }
        #endregion

        #region Quyền truy cập

        var permissions = new List<Permission>
                {
                    new("ORDER_MANAGEMENT", AdminRoleName, "CREATE"),
                    new("ORDER_MANAGEMENT", AdminRoleName, "UPDATE"),
                    new("ORDER_MANAGEMENT", AdminRoleName, "DELETE"),
                    new("ORDER_MANAGEMENT", UserRoleName, "VIEW"),
                };

        _context.Permissions.AddRange(permissions);
        await _context.SaveChangesAsync();

        #endregion

        var functions = _context.Functions;

        if (!_context.CommandInFunctions.Any())
        {
            foreach (var function in functions)
            {
                var createAction = new CommandInFunction()
                {
                    CommandId = "CREATE",
                    FunctionId = function.Id
                };
                _context.CommandInFunctions.Add(createAction);

                var updateAction = new CommandInFunction()
                {
                    CommandId = "UPDATE",
                    FunctionId = function.Id
                };
                _context.CommandInFunctions.Add(updateAction);
                var deleteAction = new CommandInFunction()
                {
                    CommandId = "DELETE",
                    FunctionId = function.Id
                };
                _context.CommandInFunctions.Add(deleteAction);

                var viewAction = new CommandInFunction()
                {
                    CommandId = "VIEW",
                    FunctionId = function.Id
                };
                _context.CommandInFunctions.Add(viewAction);
            }
        }

        if (!_context.Permissions.Any())
        {
            var adminRole = await _roleManager.FindByNameAsync(AdminRoleName);
            if (functions != null && adminRole != null)
            {
                foreach (var function in functions)
                {
                    _context.Permissions.Add(new Permission(function.Id, adminRole.Id, "CREATE"));
                    _context.Permissions.Add(new Permission(function.Id, adminRole.Id, "UPDATE"));
                    _context.Permissions.Add(new Permission(function.Id, adminRole.Id, "DELETE"));
                    _context.Permissions.Add(new Permission(function.Id, adminRole.Id, "VIEW"));
                }
            }
        }

        // Checking if there are any languages already seeded
        if (!_context.SystemLanguages.Any())
        {
            var languages = new List<SystemLanguage>
            {
                new()
                {
                    Id = "en_US",
                    Name = "English",
                    UrlImage = "en.png",
                    IsActive = true
                },
                new()
                {
                    Id = "vi_VN",
                    Name = "Vietnamese",
                    UrlImage = "vn.png",
                    IsActive = true
                },
                new()
                {
                    Id = "zh_TW",
                    Name = "繁體中文",
                    UrlImage = "zh.png",
                    IsActive = true
                }
            };

            await _context.SystemLanguages.AddRangeAsync(languages);
            await _context.SaveChangesAsync();
        }

        await _context.SaveChangesAsync();
    }
}
