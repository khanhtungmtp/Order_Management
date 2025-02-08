import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NzSpinnerCustomService } from '@services/common/nz-spinner.service';
import { PreloaderService } from '@services/common/preloader.service';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { filter } from 'rxjs';
import { fadeRouteAnimation } from './admin/animations/fade.animation';
import { AsyncPipe } from '@angular/common';
import { NzBackTopModule } from 'ng-zorro-antd/back-top';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { LockScreenStoreService } from './_core/services/common/lock-screen-store.service';
import { LockScreenComponent } from './admin/shared/components/lock-screen/lock-screen.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LockScreenComponent, NzBackTopModule, RouterOutlet, NzSpinModule, AsyncPipe],
  template: `
   @if ((lockedState$ | async)!.locked) {
      <app-lock-screen></app-lock-screen>
    }
    <nz-back-top></nz-back-top>
    <div class="full-height" [@fadeRouteAnimation]="prepareRoute(outlet)">
      <router-outlet #outlet="outlet"></router-outlet>
    </div>
    @if (loading$ | async) {
      <div style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:1001;background:rgba(24,144,255,0.1);">
        <div style="position:absolute;top: 50%;left:50%;margin:-16px 0 0 -16px;">
          <nz-spin nzSize="large"></nz-spin>
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeRouteAnimation],
  styles: ``
})
export class AppComponent implements OnInit, AfterViewInit {
  private preloader = inject(PreloaderService);
  private lockScreenStoreService = inject(LockScreenStoreService);
  private spinService = inject(NzSpinnerCustomService);
  private router = inject(Router);

  loading$ = this.spinService.getCurrentGlobalSpinStore();
  lockedState$ = this.lockScreenStoreService.getLockScreenStore();
  destroyRef = inject(DestroyRef);

  prepareRoute(outlet: RouterOutlet): string {
    return outlet?.activatedRouteData?.['key'];
  }

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event: NzSafeAny) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.spinService.hide();
      });
  }

  ngAfterViewInit(): void {
    this.preloader.removePreLoader();
  }
}
