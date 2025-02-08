using API._Services.Interfaces.OrderManager;
using API.Dtos.OrderManager;
using API.Filters.Authorization;
using API.Helpers.Base;
using API.Helpers.Constants;
using API.Helpers.Utilities;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.OrderManager;

public class OrderManagerController : BaseController
{
    private readonly I_OrderManager _orderService;

    public OrderManagerController(I_OrderManager functionService)
    {
        _orderService = functionService;
    }

    // url: GET : http:localhost:6001/api/order
    [HttpGet]
    [ClaimRequirement(FunctionCode.SYSTEM_FUNCTION, CommandCode.VIEW)]
    public async Task<IActionResult> GetAllPaging([FromQuery] PaginationParam pagination)
    {
        return Ok(await _orderService.GetPagingAsync(pagination));
    }

    // url: POST : http://localhost:6001/api/order
    [HttpPost]
    [ClaimRequirement(FunctionCode.ORDER_MANAGEMENT, CommandCode.CREATE)]
    public async Task<IActionResult> CreateOrder([FromBody] OrderManagerCreateRequest request)
    {
        var result = await _orderService.CreateAsync(request);
        return HandleResult(result);
    }

    // url: GET : http:localhost:6001/api/order/{orderId}
    [HttpGet("{orderId}")]
    [ClaimRequirement(FunctionCode.ORDER_MANAGEMENT, CommandCode.VIEW)]
    public async Task<IActionResult> GetById(Guid orderId)
    {
        var result = await _orderService.FindByOrderIdAsync(orderId);
        return HandleResult(result);
    }

    // url: GET : http:localhost:6001/api/order/details/{orderId}
    [HttpGet("details/{orderId}")]
    [ClaimRequirement(FunctionCode.ORDER_MANAGEMENT, CommandCode.VIEW)]
    public async Task<IActionResult> GetOrderDetail(Guid orderId)
    {
        var result = await _orderService.FindByOrderDetailAsync(orderId);
        return HandleResult(result);
    }

    // url: PUT : http:localhost:6001/api/order/{orderId}
    [HttpPut]
    [ClaimRequirement(FunctionCode.ORDER_MANAGEMENT, CommandCode.UPDATE)]
    public async Task<IActionResult> UpdateOrder([FromQuery] OrderManagerUpdateRequest request)
    {
        var result = await _orderService.PutAsync(request);
        return HandleResult(result);
    }

    // url: DELETE : http:localhost:6001/api/order/{orderId}
    [HttpDelete("DeleteOrder")]
    [ClaimRequirement(FunctionCode.ORDER_MANAGEMENT, CommandCode.DELETE)]
    public async Task<IActionResult> DeleteOrder(Guid orderId)
    {
        var result = await _orderService.DeleteAsync(orderId);
        return HandleResult(result);
    }
}
