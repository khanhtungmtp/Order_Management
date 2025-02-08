import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NzSpinnerCustomService {
  private globalSpin$ = new BehaviorSubject<boolean>(false);

  // show | hide
  show(): void {
    this.globalSpin$.next(true);
  }

  hide(): void {
    this.globalSpin$.next(false);
  }

  getCurrentGlobalSpinStore(): Observable<boolean> {
    return this.globalSpin$.asObservable();
  }
}
