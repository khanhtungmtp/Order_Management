import { DestroyRef, inject, Injectable } from '@angular/core';
import { LockedKey, salt } from '@app/_core/constants/app.constants';
import { fnDecrypt, fnEncrypt } from '@app/_core/utilities/tools';
import { first } from 'rxjs/operators';
import { LockScreenStoreService } from './lock-screen-store.service';
import { WindowService } from './window.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


// Surveillance lock screen status
@Injectable({
  providedIn: 'root'
})
export class SubLockedStatusService {
  private windowSer = inject(WindowService);
  private lockScreenStoreService = inject(LockScreenStoreService);
  destroyRef = inject(DestroyRef);
  initLockedStatus(): void {
    // Determine whether there is a cache
    const hasCash = this.windowSer.getSessionStorage(LockedKey);
    if (hasCash) {
      this.lockScreenStoreService.setLockScreenStore(fnDecrypt(hasCash, salt));
    } else {
      this.lockScreenStoreService
        .getLockScreenStore()
        .pipe(first(), takeUntilDestroyed(this.destroyRef))
        .subscribe(res => this.windowSer.setSessionStorage(LockedKey, fnEncrypt(JSON.stringify(res), salt)));
    }
  }
}
