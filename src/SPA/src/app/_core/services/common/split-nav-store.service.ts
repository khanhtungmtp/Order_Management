import { Injectable } from '@angular/core';
import { FunctionTreeVM } from '@app/_core/models/system/functionvm';
import { BehaviorSubject, Observable } from 'rxjs';

/*** When automatically splitting the menu, the store on the left menu
 */
@Injectable({
  providedIn: 'root'
})
export class SplitNavStoreService {
  private splitLeftNavArray$ = new BehaviorSubject<FunctionTreeVM[]>([]);

  setSplitLeftNavArrayStore(menu: FunctionTreeVM[]): void {
    this.splitLeftNavArray$.next(menu);
  }

  getSplitLeftNavArrayStore(): Observable<FunctionTreeVM[]> {
    return this.splitLeftNavArray$.asObservable();
  }
}
