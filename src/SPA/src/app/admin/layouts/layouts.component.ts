import { AsyncPipe, NgClass, NgOptimizedImage, NgStyle, NgTemplateOutlet } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, OnInit, ViewChild, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { Observable } from 'rxjs';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzNoAnimationModule } from 'ng-zorro-antd/core/no-animation';
import { fadeRouteAnimation } from '../animations/fade.animation';
import { SettingDrawerComponent, Theme } from './setting-drawer/setting-drawer.component';
import { TopProgressBarComponent } from '../shared/components/top-progress-bar/top-progress-bar.component';
import { ChatComponent } from '../shared/components/chat/chat.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { ToolBarComponent } from './tool-bar/tool-bar.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { LayoutHeadRightMenuComponent } from './layout-head-right-menu/layout-head-right-menu.component';
import { TabComponent } from './tab/tab.component';
import { NavDrawerComponent } from './nav-drawer/nav-drawer.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SideNavWidth, CollapsedNavWidth, IsFirstLogin } from '@app/_core/constants/app.constants';
import { ThemeService, SettingInterface } from '@app/_core/services/common/theme.service';
import { WindowService } from '@app/_core/services/common/window.service';
import { DriverService } from '@app/_core/services/common/driver.service';
import { SplitNavStoreService } from '@app/_core/services/common/split-nav-store.service';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { FunctionTreeVM } from '@app/_core/models/system/functionvm';

export interface IBreadcrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-layouts',
  templateUrl: './layouts.component.html',
  styleUrls: ['./layouts.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeRouteAnimation],
  standalone: true,
  imports: [
    TopProgressBarComponent,
    NzLayoutModule,
    NgClass,
    NzNoAnimationModule,
    NgStyle,
    SettingDrawerComponent,
    ChatComponent,
    NzMenuModule,
    NzButtonModule,
    NzIconModule,
    AsyncPipe,
    SideNavComponent,
    NgTemplateOutlet,
    ToolBarComponent,
    NzIconModule,
    NzButtonModule,
    NavBarComponent,
    LayoutHeadRightMenuComponent,
    TabComponent,
    RouterOutlet,
    NavDrawerComponent,
    AsyncPipe,
    NgOptimizedImage,
    NzModalModule
  ]
})
export class LayoutsComponent implements OnInit, AfterViewInit {
  currentYear: number = new Date().getFullYear();
  @ViewChild('navDrawer') navDrawer!: NavDrawerComponent;
  SideNavWidth = SideNavWidth;
  CollapsedNavWidth = CollapsedNavWidth;

  destroyRef = inject(DestroyRef); // Used to destroy subscriptions
  windowService = inject(WindowService); // Used to get the window object
  driverService = inject(DriverService); // Used to guide users
  themesService = inject(ThemeService); // used to get the topic
  splitNavStoreService = inject(SplitNavStoreService); // The store used to get the split menu

  isNightTheme$ = this.themesService.getIsNightTheme();
  themesOptions$ = this.themesService.getThemesMode();
  isOverMode$: Observable<boolean> = this.themesService.getIsOverMode();
  isCollapsed$: Observable<boolean> = this.themesService.getIsCollapsed();
  mixinModeLeftNav$ = this.splitNavStoreService.getSplitLeftNavArrayStore();

  showChats = true; // Whether to display the chat window
  isMixinMode = false; // Is it a mixed mode?
  isNightTheme = false; // Is it a dark theme?
  isFixedLeftNav = false; // Whether to pin the left menu
  isSplitNav = false; // Whether to split the menu
  isCollapsed = false; // Whether to collapse the left menu
  isOverMode = false; // When the window becomes narrower, whether the navigation bar becomes drawer mode
  isShowTab = false; // Whether to display tabs
  isFixedTab = false; // Whether to pin the tab
  isHasNavArea = false; // Is there a menu area
  isHasNavHeadArea = false; // Is there a menu header area?
  isHasFooterArea = false; // Is there a bottom area
  isHasTopArea = false; // Is there a top area

  isFixedHead = false; // Whether to fix the head
  isSideMode = false; // Whether it is side mode
  isTopMode = false; // Is it top mode?
  theme: Theme['key'] = 'dark'; // theme mode

  themesOptions!: SettingInterface;
  mixinModeLeftNav: FunctionTreeVM[] = []; // Left menu in blended mode
  contentMarginTop = '48px';

  changeCollapsed(isCollapsed: boolean): void {
    // If it is in over mode, click the left menu to display the drawer menu
    if (this.isOverMode) {
      this.navDrawer.showDraw();
      return;
    }
    this.isCollapsed = isCollapsed;
    // Set whether the left menu is collapsed
    this.themesService.setIsCollapsed(this.isCollapsed);
  }

  // Route animation
  prepareRoute(outlet: RouterOutlet): string {
    return outlet?.activatedRouteData?.['key'];
  }

  judgeMarginTop(): string {
    if (this.isFixedHead && !this.isMixinMode && this.isHasTopArea) {
      return this.isShowTab ? (this.isFixedTab ? '96px' : '48px') : '48px';
    } else {
      return this.isShowTab ? (this.isFixedTab ? '48px' : '0px') : '0px';
    }
  }

  getThemeOptions(): void {
    this.themesOptions$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res => {
      this.themesOptions = res;

      const { fixedTab, fixedHead, hasFooterArea, mode, fixedLeftNav, hasNavArea, hasTopArea, hasNavHeadArea, isShowTab, splitNav, theme } = this.themesOptions;

      this.isMixinMode = mode === 'mixin';
      this.isSideMode = mode === 'side';
      this.isTopMode = mode === 'top';
      this.isFixedLeftNav = fixedLeftNav;
      this.isHasNavArea = hasNavArea;
      this.isHasTopArea = hasTopArea;
      this.isHasNavHeadArea = hasNavHeadArea;
      this.isShowTab = isShowTab;
      this.isSplitNav = splitNav;
      this.theme = theme;
      this.isFixedHead = fixedHead;
      this.isHasFooterArea = hasFooterArea;
      this.isFixedTab = fixedTab;

      this.contentMarginTop = this.judgeMarginTop();
    });

    this.isCollapsed$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res => (this.isCollapsed = res));
    this.isOverMode$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res => (this.isOverMode = res));
    this.isNightTheme$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res => (this.isNightTheme = res));
    this.mixinModeLeftNav$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res => (this.mixinModeLeftNav = res));
  }

  ngAfterViewInit(): void {
    if (this.windowService.getStorage(IsFirstLogin) === 'false') {
      return;
    }
    this.windowService.setStorage(IsFirstLogin, 'false');
    this.driverService.load();
  }

  ngOnInit(): void {
    this.getThemeOptions();
  }
}
