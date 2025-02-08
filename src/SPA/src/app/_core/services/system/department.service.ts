import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseHttpService } from '../base-http.service';
import { SearchCommonVO, PageInfo } from '@app/_core/models/common/types';

/*
 *  部门列表
 * */
export interface Dept {
  id?: number;
  departmentName: string;
  fatherId: number;
  state: 1 | 0;
  orderNum: number;
}

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  http = inject(BaseHttpService);

  public getDepts(param: SearchCommonVO<Dept>): Observable<PageInfo<Dept>> {
    return this.http.post('/department/list/', param);
  }

  public getDeptsDetail(id: number): Observable<Dept> {
    return this.http.get(`/department/${id}/`);
  }

  public addDepts(param: Dept): Observable<void> {
    return this.http.post('/department/', param);
  }

  public delDepts(ids: number[]): Observable<void> {
    return this.http.post('/department/del/', { ids });
  }

  public editDepts(param: Dept): Observable<void> {
    return this.http.put('/department/', param);
  }
}
