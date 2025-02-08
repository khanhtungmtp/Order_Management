import { Injectable, inject } from '@angular/core';
import { ModalWrapService } from '@app/_core/utilities/base-modal';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { ModalOptions } from 'ng-zorro-antd/modal';
import { FunctionModalComponent } from './function-modal.component';
import { FunctionVM } from '@app/_core/models/system/functionvm';

@Injectable({
  providedIn: 'root'
})
export class FunctionModalService {
  private modalWrapService = inject(ModalWrapService);

  protected getContentComponent(): NzSafeAny {
    return FunctionModalComponent;
  }

  public show(modalOptions: ModalOptions = {}, modalData?: FunctionVM) {
    return this.modalWrapService.show(this.getContentComponent(), modalOptions, modalData);
  }
}
