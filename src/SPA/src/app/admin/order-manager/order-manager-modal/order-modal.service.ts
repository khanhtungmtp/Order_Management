import { Injectable, inject } from '@angular/core';
import { ModalWrapService } from '@app/_core/utilities/base-modal';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { ModalOptions } from 'ng-zorro-antd/modal';
import { OrderModalComponent } from './order-modal.component';
import { OrderDto } from '@app/_core/models/order-manager/orderdto';

@Injectable({
  providedIn: 'root'
})
export class OrderManagerModalService {
  private modalWrapService = inject(ModalWrapService);

  protected getContentComponent(): NzSafeAny {
    return OrderModalComponent;
  }
 
  protected getContentViewComponent(): NzSafeAny {
    return OrderModalComponent;
  }

  public show(modalOptions: ModalOptions = {}, modalData?: OrderDto) {
    return this.modalWrapService.show(this.getContentComponent(), modalOptions, modalData);
  }
 
  public view(modalOptions: ModalOptions = {}, modalData?: OrderDto) {
    return this.modalWrapService.show(this.getContentViewComponent(), modalOptions, modalData);
  }
}
