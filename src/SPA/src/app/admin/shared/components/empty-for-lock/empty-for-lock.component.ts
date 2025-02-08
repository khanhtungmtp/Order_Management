import { Component, ChangeDetectionStrategy, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LockScreenFlag, LockScreenStoreService } from '@app/_core/services/common/lock-screen-store.service';

/*This component can still check the hidden page in order to solve the lock screen, and the blank page created*/

@Component({
  selector: 'app-empty-for-lock',
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class EmptyForLockComponent {
  // Lock screen status of the route
  routeStatus!: LockScreenFlag;
  destroyRef = inject(DestroyRef);
  private lockScreenStoreService = inject(LockScreenStoreService);

  constructor() {
    this.lockScreenStoreService
      .getLockScreenStore()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.routeStatus = res;
      });
  }
}
