import { Injectable, inject } from '@angular/core';
import { BaseHttpService } from '../base-http.service';
import { PaginationParam, PagingResult } from '@app/_core/utilities/pagination-utility';
import { UserVM } from '@app/_core/models/user-manager/uservm';
import { UserSearchRequest } from './../../models/user-manager/usersearchrequest';
import { UserPasswordChangeRequest } from '@app/_core/models/user-manager/userpasswordchangerequest';

@Injectable({
  providedIn: 'root'
})
export class UserManagerService {
  httpBase = inject(BaseHttpService);

  getUsersPaging(pagination: PaginationParam, request: UserSearchRequest) {
    const params = { ...pagination, ...request };
    return this.httpBase.get<PagingResult<UserVM>>('Users', params);
  }

  getById(id: string) {
    return this.httpBase.get<UserVM>(`Users/${id}`);
  }

  add(request: UserVM) {
    return this.httpBase.post<string>('Users', request, { needSuccessInfo: true, typeAction: 'add' });
  }

  edit(id: string, request: UserVM) {
    return this.httpBase.put<string>(`Users/${id}`, request, { needSuccessInfo: true, typeAction: 'edit' });
  }

  updateStatus(id: string, isActive: boolean) {
    return this.httpBase.patch<string>(`Users/${id}/UpdateStatus`, isActive, { needSuccessInfo: true, typeAction: 'edit' });
  }

  delete(id: string) {
    return this.httpBase.delete<string>(`Users/${id}`, { needSuccessInfo: true });
  }

  deleteRange(ids: string[]) {
    return this.httpBase.delete<boolean>('Users/DeleteUsers', ids);
  }

  changePassword(userId: string, request: UserPasswordChangeRequest) {
    return this.httpBase.put<boolean>(`Users/${userId}/change-password`, request);
  }

}
