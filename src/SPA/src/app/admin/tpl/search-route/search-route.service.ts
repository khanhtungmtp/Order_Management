import { inject, Injectable, Type } from '@angular/core';
import { Observable } from 'rxjs';

import { ModalOptions } from 'ng-zorro-antd/modal';

import { SearchRouteComponent } from './search-route.component';
import { ModalResponse, ModalWrapService } from '@app/_core/utilities/base-modal';

@Injectable({
  providedIn: 'root'
})
export class SearchRouteService {
  private modalWrapService = inject(ModalWrapService);

  protected getContentComponent(): Type<SearchRouteComponent> {
    return SearchRouteComponent;
  }

  public show(modalOptions: ModalOptions = {}, params?: object): Observable<ModalResponse> {
    return this.modalWrapService.show(this.getContentComponent(), modalOptions, params);
  }
}
