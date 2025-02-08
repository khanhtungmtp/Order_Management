import { BreakpointObserver } from '@angular/cdk/layout';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs/operators';


import { SideCollapsedMaxWidth, TopCollapsedMaxWidth } from '@app/_core/constants/app.constants';
import { EquipmentWidth, WindowsWidthService } from './windows-width.service';
import { ThemeService } from './theme.service';

/*Surveying screen width service*/
@Injectable({
  providedIn: 'root'
})
export class SubWindowWithService {
  subWidthObj: { [key: string]: [EquipmentWidth, [number, number]] } = {
    '(max-width: 575.98px)': [EquipmentWidth.xs, [0, 575.98]],
    '(min-width: 576px) and (max-width: 767.98px)': [EquipmentWidth.sm, [576, 767.98]],
    '(min-width: 768px) and (max-width: 991.98px)': [EquipmentWidth.md, [768, 991.98]],
    '(min-width: 992px) and (max-width: 1199.98px)': [EquipmentWidth.lg, [992, 1199.98]],
    '(min-width: 1200px) and (max-width: 1599.98px)': [EquipmentWidth.xl, [1200, 1599.98]],
    '(min-width: 1600px)': [EquipmentWidth.xxl, [1600, 9999]]
  };
  private destroyRef = inject(DestroyRef);
  private winWidthService = inject(WindowsWidthService);
  private breakpointObserver = inject(BreakpointObserver);
  private themesService = inject(ThemeService);

  // The theme of monitoring (is TOP, or SIDE), determine the minimum width of the OVER mode
  subWidthForTheme(): void {
    this.themesService
      .getThemesMode()
      .pipe(
        switchMap(res => {
          let maxWidth = '';
          if (res.mode === 'side' || (res.mode === 'mixin' && !res.splitNav)) {
            maxWidth = `(max-width: ${SideCollapsedMaxWidth}px)`;
          } else if (res.mode === 'top' || (res.mode === 'mixin' && res.splitNav)) {
            maxWidth = `(max-width: ${TopCollapsedMaxWidth}px)`;
          }
          // 可以入参[Breakpoints.Small, Breakpoints.XSmall]
          return this.breakpointObserver.observe([maxWidth]);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(result => {
        const isOverMode = result.matches;
        this.themesService.setIsOverMode(isOverMode);
        //It is the OVER mode.
        if (isOverMode) {
          this.themesService.setIsCollapsed(false);
        }
      });
  }

  // Determine which grid node is based on the transmitted screen width
  judgeWindowsWidth(width: number): EquipmentWidth {
    let currentPoint: EquipmentWidth;
    Object.values(this.subWidthObj).forEach(item => {
      if (width >= item[1][0] && width <= item[1][1]) {
        currentPoint = item[0];
      }
    });
    return currentPoint!;
  }

  // The width of the monitoring browser is used for universal grid system
  subWidthForStore(): void {
    this.breakpointObserver
      .observe(Object.keys(this.subWidthObj))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        Object.keys(res.breakpoints).forEach(item => {
          if (res.breakpoints[item]) {
            this.winWidthService.setWindowWidthStore(this.subWidthObj[item][0]);
          }
        });
      });
  }

  subWindowWidth(): void {
    this.subWidthForTheme();
    this.subWidthForStore();
    // When initialization, set the current node
    this.winWidthService.setWindowWidthStore(this.judgeWindowsWidth(window.innerWidth));
  }
}
