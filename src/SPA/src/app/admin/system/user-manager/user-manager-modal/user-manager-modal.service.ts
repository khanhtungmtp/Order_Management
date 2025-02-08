import { Injectable, inject } from '@angular/core';
import { ModalWrapService } from '@app/_core/utilities/base-modal';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { ModalOptions } from 'ng-zorro-antd/modal';
import { UserManagerModalComponent } from './user-manager-modal.component';
import { UserVM } from '@app/_core/models/user-manager/uservm';

@Injectable({
  providedIn: 'root'
})
export class UserManagerModalService {
  private modalWrapService = inject(ModalWrapService);

  protected getContentComponent(): NzSafeAny {
    return UserManagerModalComponent;
  }

  public show(modalOptions: ModalOptions = {}, modalData?: UserVM) {
    return this.modalWrapService.show(this.getContentComponent(), modalOptions, modalData);
  }
}
