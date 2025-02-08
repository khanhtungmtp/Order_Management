using API.Dtos.OrderManager;
using API.Helpers.Base;
using static API.Configurations.DependencyInjectionConfig;

namespace API._Services.Interfaces.OrderManager;

[DependencyInjection(ServiceLifetime.Scoped)]
public interface I_OrderManager
{
    Task<OperationResult<string>> CreateAsync(OrderManagerCreateRequest request);
    Task<OperationResult<string>> PutAsync(OrderManagerUpdateRequest request);
    Task<OperationResult> DeleteAsync(Guid orderId);
    Task<OperationResult<OrderDto>> FindByOrderIdAsync(Guid orderId);
}
