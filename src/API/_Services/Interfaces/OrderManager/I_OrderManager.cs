using API.Dtos.OrderManager;
using API.Helpers.Base;
using API.Helpers.Utilities;
using static API.Configurations.DependencyInjectionConfig;

namespace API._Services.Interfaces.OrderManager;

[DependencyInjection(ServiceLifetime.Scoped)]
public interface I_OrderManager
{
    Task<OperationResult<PagingResult<OrderDto>>> GetPagingAsync(PaginationParam pagination);
    Task<OperationResult<string>> CreateAsync(OrderManagerCreateRequest request);
    Task<OperationResult<string>> PutAsync(OrderManagerUpdateRequest request);
    Task<OperationResult> DeleteAsync(Guid orderId);
    Task<OperationResult<OrderDto>> FindByOrderIdAsync(Guid orderId);
    Task<OperationResult<List<OrderDetailDto>>> FindByOrderDetailAsync(Guid orderId);
    Task<OperationResult<string>> GetTotalProducts(ProductRequest request);
    Task<OperationResult<List<KeyValuePair<string, string>>>> GetListProductsAsync();
}
