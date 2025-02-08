import { Injectable } from '@angular/core';
import { FunctionVM } from '@app/_core/models/system/functionvm';
import { PaginationParam, PagingResult } from '@app/_core/utilities/pagination-utility';
import { BaseHttpService } from '../base-http.service';
import { CommandVM } from '@app/_core/models/system/commandvm';

@Injectable({
  providedIn: 'root'
})
export class FunctionService {
  constructor(private httpBase: BaseHttpService,) {
  }

  getFunctionsPaging(filter: string = '', pagination: PaginationParam) {
    const params = { ...pagination, filter };
    return this.httpBase.get<PagingResult<FunctionVM>>('Functions', params);
  }

  getParentIds() {
    return this.httpBase.get<FunctionVM[]>(`Functions/parentids`);
  }

  getCommands() {
    return this.httpBase.get<CommandVM[]>(`Functions/commands`);
  }

  getById(id: string) {
    return this.httpBase.get<FunctionVM>(`Functions/${id}`);
  }

  add(request: FunctionVM) {
    return this.httpBase.post<string>('Functions', request, { needSuccessInfo: true, typeAction: 'add' });
  }

  edit(id: string, request: FunctionVM) {
    return this.httpBase.put<string>(`Functions/${id}`, request, { needSuccessInfo: true, typeAction: 'edit' });
  }

  delete(id: string) {
    return this.httpBase.delete<string>(`Functions/${id}`);
  }

  deleteRange(ids: string[]) {
    return this.httpBase.delete<boolean>('Functions/DeleteRangeFunction', ids);
  }
}
