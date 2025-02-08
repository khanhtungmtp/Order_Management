import { DOCUMENT } from '@angular/common';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ThemeService } from '@services/common/theme.service';
import { driver, DriveStep } from 'driver.js';
/*
 * https://madewith.cn/766
 * Guide pages
 * */
@Injectable({
  providedIn: 'root'
})
export class DriverService {
  themesService = inject(ThemeService);
  destroyRef = inject(DestroyRef);
  private readonly doc = inject(DOCUMENT);

  load(): void {
    // Whether it is a fixed tab
    let tabId = '';
    this.themesService
      .getThemesMode()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        tabId = !res.fixedTab ? '#multi-tab' : '#multi-tab2';
      });
    const steps: DriveStep[] = [
      {
        element: '#menuNav',
        popover: {
          title: 'menu',
          description: 'here is the menu',
          side: 'right',
          align: 'center'
        }
      },
      {
        element: '#drawer-handle',
        popover: {
          title: 'Theme settings button',
          description: 'Click to expand and set the theme, you can drag it up and down',
          side: 'left'
        }
      },
      {
        element: '#tools',
        popover: {
          title: 'toolbar',
          description: 'Lock screen, search menu, full screen, notification message, log out, multi-language',
          side: 'bottom'
        }
      },
      {
        element: '#chats',
        popover: {
          title: 'Contact administrator',
          description: 'Contact the administrator',
          side: 'top'
        }
      },
      {
        element: '#trigger',
        popover: {
          title: 'Collapse menu',
          description: 'Menu collapse',
          side: 'bottom'
        }
      },
      {
        element: tabId,
        popover: {
          title: 'multiple tags',
          description: 'Right-click a single tab to expand multiple options. Once the screen goes beyond the screen, scroll the tabs by rolling the mouse wheel.',
          side: 'bottom'
        }
      }
    ];

    const driverObj = driver({
      showProgress: true,
      animate: true,
      allowClose: true,
      doneBtnText: 'Finish',
      nextBtnText: 'Next step',
      prevBtnText: 'Previous',
      onHighlightStarted: () => {
        this.doc.body.style.cssText = 'overflow:hidden';
      },
      onDestroyed: () => {
        this.doc.body.style.cssText = 'overflow:auto';
      },
      steps
    });

    driverObj.drive();
  }
}
