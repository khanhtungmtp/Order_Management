import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { ModalOptions } from 'ng-zorro-antd/modal';
import { ModalWrapService } from '@app/_core/utilities/base-modal';
import { LockWidgetComponent } from './lock-widget.component';

@Injectable({
  providedIn: 'root'
})
export class LockWidgetService {
  private modalWrapService = inject(ModalWrapService);

  protected getContentComponent(): NzSafeAny {
    return LockWidgetComponent;
  }

  public show(modalOptions: ModalOptions = {}, params?: object): Observable<NzSafeAny> {
    return this.modalWrapService.show(this.getContentComponent(), modalOptions, params);
  }
}
