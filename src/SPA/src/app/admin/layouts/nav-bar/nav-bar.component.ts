import { NgTemplateOutlet, AsyncPipe } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input, inject, DestroyRef, booleanAttribute } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, mergeMap, switchMap, tap } from 'rxjs/operators';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzNoAnimationModule } from 'ng-zorro-antd/core/no-animation';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { SplitNavStoreService } from '@app/_core/services/common/split-nav-store.service';
import { TabService } from '@app/_core/services/common/tab.service';
import { ThemeService } from '@app/_core/services/common/theme.service';
import { fnStopMouseEvent } from '@app/_core/utilities/tools';
import { ThemeMode } from '../setting-drawer/setting-drawer.component';
import { MenuStoreService } from '@app/_core/services/common/menu-store.service';
import { UserInfoService } from '@app/_core/services/common/userInfo.service';
import { LocalStorageConstants } from '@app/_core/constants/local-storage.constants';
import { UserForLogged } from '@app/_core/models/auth/auth';
import { FunctionTreeVM } from '@app/_core/models/system/functionvm';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NzMenuModule, NzNoAnimationModule, NgTemplateOutlet, NzButtonModule, NzIconModule, AsyncPipe]
})
export class NavBarComponent implements OnInit {
  @Input({ transform: booleanAttribute })
  isMixinHead: boolean = false; // Is mixed mode top navigation
  @Input({ transform: booleanAttribute })
  isMixinLeft: boolean = false;

  private router = inject(Router);
  private userInfoService = inject(UserInfoService);
  private menuServices = inject(MenuStoreService);
  private splitNavStoreService = inject(SplitNavStoreService);
  private activatedRoute = inject(ActivatedRoute);
  private tabService = inject(TabService);
  private cdr = inject(ChangeDetectorRef);
  private themesService = inject(ThemeService);

  routerPath: string = this.router.url;
  copyMenus: FunctionTreeVM[] = [];
  authCodeArray: string[] = [];

  themesOptions$ = this.themesService.getThemesMode();
  isNightTheme$ = this.themesService.getIsNightTheme();
  isCollapsed$ = this.themesService.getIsCollapsed();
  isOverMode$ = this.themesService.getIsOverMode();
  leftMenuArray$ = this.splitNavStoreService.getSplitLeftNavArrayStore();
  subTheme$: Observable<any>;
  userProfile: UserForLogged = JSON.parse(localStorage.getItem(LocalStorageConstants.USER) as string);
  themesMode: ThemeMode['key'] = 'side';
  isOverMode: boolean = false;
  isCollapsed: boolean = false;
  isMixinMode: boolean = false;
  leftMenuArray: FunctionTreeVM[] = [];
  leftMenu: FunctionTreeVM[] = [];

  destroyRef = inject(DestroyRef);

  constructor() {
    // this.initMenus();
    this.getMenuByUser();
    this.subTheme$ = this.isOverMode$.pipe(
      switchMap(res => {
        this.isOverMode = res;
        return this.themesOptions$;
      }),
      tap(options => {
        this.themesMode = options.mode;
        this.isMixinMode = this.themesMode === 'mixin';
      }),
      takeUntilDestroyed(this.destroyRef)
    );

    // Listen to the left menu data source in mixed mode
    this.subMixinModeSideMenu();
    // Listen to collapse menu events
    this.subIsCollapsed();
    this.subAuth();
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        tap(() => {
          this.subTheme$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            // When the theme is switched to mixed mode, set the left menu data source
            // If placed in ngInit monitoring, it will switch routes after refreshing the page in mixed mode, runOutSideAngular
            if (this.isMixinMode) {
              this.setMixModeLeftMenu();
            }
          });
          // @ts-ignore
          this.routerPath = this.activatedRoute.snapshot['_routerState'].url;
          // Make a copyMenus to record the current menu status, because the sub-menu is not displayed in the top mode, but the theme is switched from the top mode to the sidebar mode, and the status of the menu in the current top mode must be reflected in the menu in the sidebar mode.
          this.clickMenuItem(this.leftMenu);
          this.clickMenuItem(this.copyMenus);
          // It is a folded menu and not an over menu. It solves the bug of floating box menu when switching tabs when folding the left menu.
          if (this.isCollapsed && !this.isOverMode) {
            this.closeMenuOpen(this.leftMenu);
          }

          // Top menu mode, and not over mode, solves the bug of floating box menu when switching tabs in top mode
          if (this.themesMode === 'top' && !this.isOverMode) {
            this.closeMenu();
          }
        }),
        map(() => this.activatedRoute),
        map(route => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter(route => {
          return route.outlet === 'primary';
        }),
        mergeMap(route => {
          return route.data;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(routeData => {
        // Whether the details page opens a new tab page
        let isNewTabDetailPage = routeData['newTab'] === 'true';
        this.routeEndAction(isNewTabDetailPage);
      });
  }

  initMenus(): void {
    this.menuServices
      .getMenuArrayStore()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(menusArray => {
        this.leftMenu = menusArray;
        this.copyMenus = this.cloneMenuArray(this.leftMenu);
        this.clickMenuItem(this.leftMenu);
        this.clickMenuItem(this.copyMenus);
        this.cdr.markForCheck();
      });
  }

  getMenuByUser() {
    this.menuServices.getMenuByUserId(this.userProfile.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.leftMenu = res;
        this.cdr.markForCheck();
      }
    })
  }

  // Data source for left menu "auto-split menu" mode when setting blending mode
  setMixModeLeftMenu(): void {
    this.leftMenu.forEach(item => {
      if (item.selected) {
        this.splitNavStoreService.setSplitLeftNavArrayStore(item.children || []);
      }
    });
  }

  // Deep copy clone menu array
  cloneMenuArray(sourceMenuArray: FunctionTreeVM[], target: FunctionTreeVM[] = []): FunctionTreeVM[] {
    sourceMenuArray.forEach(item => {
      const obj: FunctionTreeVM = { id: '', name: '', menuType: 'C', url: '', parentId: '', sortOrder: 0, icon: '', children: [], newLinkFlag: false, open: false, selected: false };
      for (let i in item) {
        if (item.hasOwnProperty(i)) {
          // @ts-ignore
          if (Array.isArray(item[i])) {
            // @ts-ignore
            obj[i] = this.cloneMenuArray(item[i]);
          } else {
            // @ts-ignore
            obj[i] = item[i];
          }
        }
      }
      target.push({ ...obj });
    });
    return target;
  }

  // Click the first-level menu in mixed mode to make the first submenu under the first-level menu selected.
  changTopNav(index: number): void {
    // The currently selected first-level menu object
    const currentTopNav = this.leftMenu[index];
    let currentLeftNavArray = currentTopNav.children || [];
    // If there is a second-level menu under the first-level menu
    if (currentLeftNavArray.length > 0) {
      //Current left navigation array
      /*Added permission version*/
      // Get the authorized secondary menu collection (shown on the left)
      // currentLeftNavArray = currentLeftNavArray.filter(item => {
      //   return this.authCodeArray.includes(item.code!);
      // });
      // If the first second-level menu, there is no third-level menu
      if (currentLeftNavArray.length > 0 && !currentLeftNavArray[0].children) {
        this.router.navigateByUrl(currentLeftNavArray[0].url!);
      } else if (currentLeftNavArray.length > 0 && currentLeftNavArray[0].children) {
        // If there is a third-level menu, jump to the first third-level menu
        this.router.navigateByUrl(currentLeftNavArray[0].children[0].url!);
      }
      /*Added permission version end*/
      /*The comment is the unauthorized version*/
      // const currentLeftNavArray = currentTopNav.children;
      // if (!currentLeftNavArray[0].children) {
      //   this.router.navigateByUrl(currentLeftNavArray[0].path!);
      //   this.splitNavStoreService.setSplitLeftNavArrayStore(currentLeftNavArray);
      // } else {
      //   this.router.navigateByUrl(currentLeftNavArray[0].children[0].path!);
      //   this.splitNavStoreService.setSplitLeftNavArrayStore(currentLeftNavArray);
      // }
    }
    this.splitNavStoreService.setSplitLeftNavArrayStore(currentLeftNavArray);
  }

  flatMenu(menus: FunctionTreeVM[], routePath: string): void {
    menus.forEach(item => {
      item.selected = false;
      item.open = false;
      if (routePath.includes(item.url) && !item.newLinkFlag) {
        item.selected = true;
        item.open = true;
      }
      if (!!item.children && item.children.length > 0) {
        this.flatMenu(item.children, routePath);
      }
    });
  }

  clickMenuItem(menus: FunctionTreeVM[]): void {
    if (!menus) {
      return;
    }
    const index = this.routerPath.indexOf('?') === -1 ? this.routerPath.length : this.routerPath.indexOf('?');
    const routePath = this.routerPath.substring(0, index);
    this.flatMenu(menus, routePath);
    this.cdr.markForCheck();
  }

  // Change the current menu display state
  changeOpen(currentMenu: FunctionTreeVM, allMenu: FunctionTreeVM[]): void {
    allMenu.forEach(item => {
      item.open = false;
    });
    currentMenu.open = true;
  }

  closeMenuOpen(menus: FunctionTreeVM[]): void {
    menus.forEach(menu => {
      menu.open = false;
      if (menu.children && menu.children.length > 0) {
        this.closeMenuOpen(menu.children);
      } else {
        return;
      }
    });
  }

  changeRoute(e: MouseEvent, menu: FunctionTreeVM): void {
    if (menu.newLinkFlag) {
      fnStopMouseEvent(e);
      window.open(menu.url, '_blank');
      return;
    }
    this.router.navigate([menu.url]);
  }

  // Listen to collapse menu events
  subIsCollapsed(): void {
    this.isCollapsed$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(isCollapsed => {
      this.isCollapsed = isCollapsed;
      // menu expand
      if (!this.isCollapsed) {
        this.leftMenu = this.cloneMenuArray(this.copyMenus);
        this.clickMenuItem(this.leftMenu);
        // In mixed mode, click the left menu data source, otherwise the menu with secondary menu will not open when the folded state changes to expanded.
        if (this.themesMode === 'mixin') {
          this.clickMenuItem(this.leftMenuArray);
        }
      } else {
        // Menu close
        this.copyMenus = this.cloneMenuArray(this.leftMenu);
        this.closeMenuOpen(this.leftMenu);
      }
      this.cdr.markForCheck();
    });
  }

  closeMenu(): void {
    this.clickMenuItem(this.leftMenu);
    this.clickMenuItem(this.copyMenus);
    this.closeMenuOpen(this.leftMenu);
  }

  subAuth(): void {
    this.userInfoService
      .getUserInfo()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => (this.authCodeArray = res.authCode));
  }

  // Listen to the left menu data source in mixed mode
  private subMixinModeSideMenu(): void {
    this.leftMenuArray$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res => {
      this.leftMenuArray = res;
    });
  }

  routeEndAction(isNewTabDetailPage = false): void {
    let route = this.activatedRoute;
    while (route.firstChild) {
      route = route.firstChild;
    }

    let title = 'Home';
    if (typeof route.routeConfig?.title === 'string') {
      title = route.routeConfig?.title;
    }

    this.tabService.addTab(
      {
        snapshotArray: [route.snapshot],
        title,
        path: this.routerPath
      },
      isNewTabDetailPage
    );
    this.tabService.findIndex(this.routerPath);
    // In mixed mode, switch tabs so that the left menu changes accordingly.
    this.setMixModeLeftMenu();
  }

  ngOnInit(): void {
    // Close the open state of the menu in top mode
    this.subTheme$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(options => {
      if (options.mode === 'top' && !this.isOverMode) {
        this.closeMenu();
      }
    });
    this.routeEndAction();
  }
}
