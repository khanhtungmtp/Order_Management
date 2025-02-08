import { Injectable } from '@angular/core';
import { PaginationParam, PagingResult } from '@app/_core/utilities/pagination-utility';
import { BaseHttpService } from '../base-http.service';
import { OrderManagerCreateRequest } from '@app/_core/models/order-manager/ordermanagercreaterequest';
import { OrderManagerUpdateRequest } from '@app/_core/models/order-manager/ordermanagerupdaterequest';
import { OrderDto } from '@app/_core/models/order-manager/orderdto';
import { OrderDetailDto } from '@app/_core/models/order-manager/orderdetaildto';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private httpBase: BaseHttpService,) {
  }

  getOrderManagerPaging(pagination: PaginationParam) {
    const params = { ...pagination };
    return this.httpBase.get<PagingResult<OrderDto>>('OrderManager', params);
  }

  getById(orderId: string) {
    return this.httpBase.get<OrderDto>(`OrderManager/${orderId}`);
  }
  
  getOrderDetail(orderId: string) {
    return this.httpBase.get<OrderDetailDto[]>(`OrderManager/details/${orderId}`);
  }

  add(request: OrderManagerCreateRequest) {
    return this.httpBase.post<string>('OrderManager', request, { needSuccessInfo: true, typeAction: 'add' });
  }

  edit(orderId: string, request: OrderManagerUpdateRequest) {
    return this.httpBase.put<string>(`OrderManager/${orderId}`, request, { needSuccessInfo: true, typeAction: 'edit' });
  }

  delete(orderId: string) {
    return this.httpBase.delete<string>(`OrderManager/${orderId}`);
  }

}
