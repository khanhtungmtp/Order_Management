using API._Repositories;
using API._Services.Interfaces.OrderManager;
using API.Dtos.OrderManager;
using API.Helpers.Base;
using API.Helpers.Enum;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API._Services.Services.OrderManager;
public class S_OrderManager : BaseServices, I_OrderManager
{
    public S_OrderManager(IRepositoryAccessor repoStore) : base(repoStore)
    {
    }

    public async Task<OperationResult<string>> CreateAsync(OrderManagerCreateRequest request)
    {
        if (!_repoStore.Customers.Any(c => c.CustomerId == request.CustomerId))
            return OperationResult<string>.BadRequest("Invalid customer.");

        using var _transaction = await _repoStore.BeginTransactionAsync();
        try
        {
            Order order = new()
            {
                CustomerId = request.CustomerId,
                OrderDate = DateTime.Now,
                TotalAmount = 0,
                Status = OrderStatus.Pending,
                OrderDetails = []
            };

            List<OrderDetail> orderDetails = [];

            foreach (var od in request.OrderDetails)
            {
                var product = await _repoStore.Products.FindAsync(od.ProductId);
                if (product == null)
                    return OperationResult<string>.BadRequest($"Product {od.ProductId} not found. Product Id: {od.ProductId}");

                if (product == null || product.StockQuantity < od.Quantity)
                    return OperationResult<string>.BadRequest($"Product {od.ProductId} is out of stock. Product Id: {od.ProductId}");

                od.SubTotal = od.Quantity * product.Price;
                product.StockQuantity -= od.Quantity;

                await _repoStore.SaveChangesAsync();

                OrderDetail orderDetail = new()
                {
                    ProductId = od.ProductId,
                    Quantity = od.Quantity,
                    SubTotal = od.SubTotal
                };

                order.OrderDetails.Add(orderDetail);
                orderDetails.Add(orderDetail);
            }

            order.TotalAmount = order.OrderDetails.Sum(od => od.SubTotal);
            // Tổng số tiền phải >= 0.
            if (order.TotalAmount == 0)
                return OperationResult<string>.BadRequest("Total amount must be greater than 0.");
            _repoStore.Orders.Add(order);

            _repoStore.OrderDetails.AddMany(orderDetails);

            await _repoStore.SaveChangesAsync();

            await _transaction.CommitAsync();

            return OperationResult<string>.Success("Create order successfully.");
        }
        catch (Exception)
        {
            await _transaction.RollbackAsync();
            return OperationResult<string>.BadRequest("Create order failed.");
        }

    }

    public async Task<OperationResult> DeleteAsync(Guid orderId)
    {
        Order? orderExists = await _repoStore.Orders.FirstOrDefaultAsync(o => o.OrderId == orderId);
        if (orderExists is null)
            return OperationResult.NotFound("Order not found.");
        _repoStore.Orders.Remove(orderExists);
        bool result = await _repoStore.SaveChangesAsync();
        if (result)
            return OperationResult.Success("Delete order successfully.");
        return OperationResult.BadRequest("Delete order failed.");
    }

    public async Task<OperationResult<OrderDto>> FindByOrderIdAsync(Guid orderId)
    {
        Order? orderExists = await _repoStore.Orders.FirstOrDefaultAsync(o => o.OrderId == orderId);
        if (orderExists is null)
            return OperationResult<OrderDto>.NotFound("Order not found.");
        OrderDto order = new()
        {
            OrderId = orderExists.OrderId,
            CustomerId = orderExists.CustomerId,
            OrderDate = orderExists.OrderDate,
            TotalAmount = orderExists.TotalAmount,
            Status = orderExists.Status
        };
        return OperationResult<OrderDto>.Success(order, "Get order by orderId successfully.");
    }

    public async Task<OperationResult<string>> PutAsync(OrderManagerUpdateRequest request)
    {
        Order? orderExists = await _repoStore.Orders.FirstOrDefaultAsync(o => o.OrderId == request.OrderId);
        if (orderExists is null)
            return OperationResult<string>.NotFound("Order not found.");
            orderExists.Status = request.Status;
        _repoStore.Orders.Update(orderExists);
        bool result = await _repoStore.SaveChangesAsync();
        if (result)
            return OperationResult<string>.Success("Update order successfully.");
        return OperationResult<string>.BadRequest("Update order failed.");
    }

}
