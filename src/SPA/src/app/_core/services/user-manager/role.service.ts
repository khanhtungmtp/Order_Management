import { inject, Injectable } from '@angular/core';
import { BaseHttpService } from '../base-http.service';
import { RoleVM } from '@app/_core/models/user-manager/rolevm';
import { PaginationParam, PagingResult } from '@app/_core/utilities/pagination-utility';
import { PermissionScreenVm } from '@app/_core/models/system/permissionscreenvm';
import { PermissionVm } from '@app/_core/models/system/permissionvm';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  httpBase = inject(BaseHttpService);

  getRolesPaging(filter: string = '', pagination: PaginationParam) {
    const params = { ...pagination, filter };
    return this.httpBase.get<PagingResult<RoleVM>>('Roles/GetPaging', params);
  }

  getTreeDataRole() {
    return this.httpBase.get<PermissionScreenVm[]>(`Roles/GetAllPermissionTree`);
  }

  getPermissionByRoleId(roleId: string) {
    return this.httpBase.get<PermissionVm[]>(`Roles/${roleId}/permissions`);
  }

  getRoles() {
    return this.httpBase.get<RoleVM[]>(`Roles/GetAll`);
  }

  getById(id: string) {
    return this.httpBase.get<RoleVM>(`Roles/${id}`);
  }

  add(model: RoleVM) {
    return this.httpBase.post<string>('Roles', model, { needSuccessInfo: true, typeAction: 'add' });
  }

  edit(id: string, model: RoleVM) {
    return this.httpBase.put<string>(`Roles/${id}`, model, { needSuccessInfo: true, typeAction: 'edit' });
  }

  putPermissions(roleId: string, request: PermissionVm[]) {
    return this.httpBase.put<string>(`Roles/${roleId}/permissions`, request, { needSuccessInfo: true, typeAction: 'edit' });
  }

  delete(id: string) {
    return this.httpBase.delete<string>(`Roles/${id}`, { needSuccessInfo: true });
  }

  deleteRange(ids: string[]) {
    return this.httpBase.delete<boolean>('Roles/DeleteRoles', ids);
  }
}
