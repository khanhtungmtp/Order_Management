import { Injectable, inject } from '@angular/core';
import { ModalWrapService } from '@app/_core/utilities/base-modal';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { ModalOptions } from 'ng-zorro-antd/modal';
import { RoleManagerModalComponent } from './role-manager-modal.component';
import { RoleVM } from '@app/_core/models/user-manager/rolevm';

@Injectable({
  providedIn: 'root'
})
export class RoleManagerModalService {
  private modalWrapService = inject(ModalWrapService);

  protected getContentComponent(): NzSafeAny {
    return RoleManagerModalComponent;
  }

  public show(modalOptions: ModalOptions = {}, modalData?: RoleVM) {
    return this.modalWrapService.show(this.getContentComponent(), modalOptions, modalData);
  }
}
