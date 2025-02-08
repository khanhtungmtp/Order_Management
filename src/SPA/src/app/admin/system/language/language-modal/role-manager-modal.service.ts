import { Injectable, inject } from '@angular/core';
import { ModalWrapService } from '@app/_core/utilities/base-modal';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { ModalOptions } from 'ng-zorro-antd/modal';
import { LanguageModalComponent } from './language-modal.component';
import { SystemLanguageVM } from '@app/_core/models/system/systemlanguagevm';

@Injectable({
  providedIn: 'root'
})
export class LanguagerModalService {
  private modalWrapService = inject(ModalWrapService);

  protected getContentComponent(): NzSafeAny {
    return LanguageModalComponent;
  }

  public show(modalOptions: ModalOptions = {}, modalData?: SystemLanguageVM) {
    return this.modalWrapService.show(this.getContentComponent(), modalOptions, modalData);
  }
}
