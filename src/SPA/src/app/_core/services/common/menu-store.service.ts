import { Injectable } from '@angular/core';
import { FunctionTreeVM } from '@app/_core/models/system/functionvm';
import { environment } from '@env/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { BaseHttpService } from '../base-http.service';

//Menu store service
@Injectable({
  providedIn: 'root'
})
export class MenuStoreService {
  /**
   *
   */
  constructor(private httpBase: BaseHttpService,) { }
  baseUrl: string = environment.apiUrl;
  private menuArray$ = new BehaviorSubject<FunctionTreeVM[]>([]);

  setMenuArrayStore(menuArray: FunctionTreeVM[]): void {
    this.menuArray$.next(menuArray);
  }

  getMenuArrayStore(): Observable<FunctionTreeVM[]> {
    return this.menuArray$.asObservable();
  }

  getMenuByUserId(userId: string) {
    return this.httpBase.get<FunctionTreeVM[]>(`Users/${userId}/menu-tree`);
  }
}
