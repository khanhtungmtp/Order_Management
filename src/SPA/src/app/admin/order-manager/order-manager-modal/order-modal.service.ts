import { Injectable, inject } from '@angular/core';
import { ModalWrapService } from '@app/_core/utilities/base-modal';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { ModalOptions } from 'ng-zorro-antd/modal';
import { OrderModalComponent } from './order-modal.component';
import { OrderDto } from '@app/_core/models/order-manager/orderdto';
import { FormComponent } from '../form/form.component';
import { OrderDetailDto } from '@app/_core/models/order-manager/orderdetaildto';

@Injectable({
  providedIn: 'root'
})
export class OrderManagerModalService {
  private modalWrapService = inject(ModalWrapService);

  protected getContentComponent(): NzSafeAny {
    return OrderModalComponent;
  }
 
  protected getContentViewComponent(): NzSafeAny {
    return FormComponent;
  }

  public show(modalOptions: ModalOptions = {}, modalData?: OrderDto) {
    return this.modalWrapService.show(this.getContentComponent(), modalOptions, modalData);
  }
 
  public view(modalOptions: ModalOptions = {}, modalData?: OrderDetailDto[]) {
    return this.modalWrapService.show(this.getContentViewComponent(), modalOptions, modalData);
  }
}
