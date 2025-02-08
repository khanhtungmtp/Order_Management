import { CdkDrag } from '@angular/cdk/drag-drop';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

import { IsNightKey, StyleThemeModelKey, ThemeOptionsKey } from '@constants/app.constants';
import { SimpleReuseStrategy } from '@services/common/reuse-strategy';
import { TabService } from '@services/common/tab.service';
import { ThemeSkinService } from '@services/common/theme-skin.service';
import { WindowService } from '@services/common/window.service';
import { SettingInterface, StyleTheme, StyleThemeInterface, ThemeService } from '@services/common/theme.service';
import { fnFormatToHump } from '@utilities/tools';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzConfigService } from 'ng-zorro-antd/core/config';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface NormalModel {
  image?: string;
  title: string;
  isChecked: boolean;
}

export interface Theme extends NormalModel {
  key: 'dark' | 'light';
}

type SpecialTheme = 'color-weak' | 'grey-theme';
type SpecialThemeHump = 'colorWeak' | 'greyTheme';

interface Color extends NormalModel {
  key: string;
  color: string;
}

export interface ThemeMode extends NormalModel {
  key: 'side' | 'top' | 'mixin';
}
type ExcludedKeys = 'theme' | 'color' | 'mode';
type SettingKey = Exclude<keyof SettingInterface, ExcludedKeys>;
@Component({
  selector: 'app-setting-drawer',
  templateUrl: './setting-drawer.component.html',
  styleUrls: ['./setting-drawer.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CdkDrag, NzIconModule, NzButtonModule, NzDrawerModule, NzToolTipModule, NzDividerModule, NzListModule, NzSwitchModule, FormsModule]
})
export class SettingDrawerComponent implements OnInit {
  private themesService = inject(ThemeService);
  private tabService = inject(TabService);
  private activatedRoute = inject(ActivatedRoute);
  private doc = inject(DOCUMENT);
  private nzConfigService = inject(NzConfigService);
  private themeSkinService = inject(ThemeSkinService);
  private windowServe = inject(WindowService);
  private rd2 = inject(Renderer2);
  destroyRef = inject(DestroyRef);
  themesOptions$ = this.themesService.getThemesMode();
  _currentStyleTheme: StyleThemeInterface = {
    default: false,
    dark: false,
    compact: false,
    aliyun: false
  };
  isNightTheme$ = this.themesService.getIsNightTheme();
  _isNightTheme = false;
  _themesOptions: SettingInterface = {
    theme: 'dark',
    color: '#1890FF',
    mode: 'side',
    fixedTab: false,
    isShowTab: true,
    splitNav: true,
    greyTheme: false,
    colorWeak: false,
    fixedLeftNav: true,
    fixedHead: true,
    hasTopArea: true,
    hasFooterArea: true,
    hasNavArea: true,
    hasNavHeadArea: true
  };
  isCollapsed = false;
  dragging = false;

  themes: Theme[] = [
    {
      key: 'dark',
      image: 'assets/imgs/theme-dark.svg',
      title: 'dark menu style',
      isChecked: true
    },
    {
      key: 'light',
      image: 'assets/imgs/theme-light.svg',
      title: 'Bright menu style',
      isChecked: false
    }
  ];
  colors: Color[] = [
    {
      key: 'dust',
      color: '#F5222D',
      title: 'dusk',
      isChecked: false
    },
    {
      key: 'volcano',
      color: '#FA541C',
      title: 'volcano',
      isChecked: false
    },
    {
      key: 'sunset',
      color: '#FAAD14',
      title: 'sunset',
      isChecked: false
    },
    {
      key: 'cyan',
      color: '#13C2C2',
      title: 'Mingqing',
      isChecked: false
    },
    {
      key: 'green',
      color: '#52C41A',
      title: 'aurora green',
      isChecked: false
    },
    {
      key: 'daybreak',
      color: '#1890FF',
      title: 'Dawn blue (default)',
      isChecked: true
    },
    {
      key: 'geekblue',
      color: '#2F54EB',
      title: 'geek blue',
      isChecked: false
    },
    {
      key: 'purple',
      color: '#722ED1',
      title: 'purple',
      isChecked: false
    }
  ];
  modes: ThemeMode[] = [
    {
      key: 'side',
      image: 'assets/imgs/menu-side.svg',
      title: 'Side menu layout',
      isChecked: true
    },
    {
      key: 'top',
      image: 'assets/imgs/menu-top.svg',
      title: 'Top menu layout',
      isChecked: false
    },
    {
      key: 'mixin',
      image: 'assets/imgs/menu-top.svg',
      title: 'Mixed menu layout',
      isChecked: false
    }
  ];

  changeCollapsed(): void {
    if (!this.dragging) {
      this.isCollapsed = !this.isCollapsed;
    } else {
      this.dragging = false;
    }
  }

  changePrimaryColor(color: Color): void {
    this.selOne(color as NormalModel, this.colors);
    this.nzConfigService.set('theme', { primaryColor: color.color });
    this._themesOptions.color = color.color;
    this.setThemeOptions();
  }

  // Modify dark night theme
  changeNightTheme(isNight: boolean): void {
    this.windowServe.setStorage(IsNightKey, `${isNight}`);
    this.themesService.setIsNightTheme(isNight);
    this.themeSkinService.toggleTheme().then();
  }

    // 修改主题
    changeStyleTheme(styleTheme: StyleTheme): void {
      // 让每个主题都变成未选中
      Object.keys(this._currentStyleTheme).forEach(item => {
        this._currentStyleTheme[item as StyleTheme] = false;
      });
      // 当前选中的主题变为选中状态
      this._currentStyleTheme[styleTheme] = true;
      // 存储主题模式状态
      this.themesService.setStyleThemeMode(styleTheme);
      // 持久化
      this.windowServe.setStorage(StyleThemeModelKey, styleTheme);
      // 切换主题
      this.themeSkinService.toggleTheme().then();
    }

  // Select one isChecked to be true and the others to be false
  selOne(item: NormalModel, itemArray: NormalModel[]): void {
    itemArray.forEach(_item => (_item.isChecked = false));
    item.isChecked = true;
  }

  changeMode(mode: ThemeMode): void {
    this.selOne(mode, this.modes);
    this.themesService.setIsCollapsed(false);
    this._themesOptions.mode = mode.key;
    this.setThemeOptions();
  }

  // switch theme
  changeTheme(themeItem: Theme): void {
    this.selOne(themeItem, this.themes);
    this._themesOptions.theme = themeItem.key;
    this.setThemeOptions();
  }

  // Set theme parameters
  setThemeOptions(): void {
    this.themesService.setThemesMode(this._themesOptions);
    this.windowServe.setStorage(ThemeOptionsKey, JSON.stringify(this._themesOptions));
  }

  // Modify fixed header
  changeFixed(isTrue: boolean, type: 'isShowTab' | 'splitNav' | 'fixedTab' | 'fixedLeftNav' | 'fixedHead' | 'hasTopArea' | 'hasFooterArea' | 'hasNavArea' | 'hasNavHeadArea'): void {
    // When the header is not fixed, the set label is not fixed either.
    if (type === 'fixedHead' && !isTrue) {
      this._themesOptions['fixedTab'] = false;
    }
    this._themesOptions[type] = isTrue;
    this.setThemeOptions();

    // If multiple tabs are not displayed, the tab and all components that have been cached must be cleared.
    if (type === 'isShowTab') {
      if (!isTrue) {
        SimpleReuseStrategy.deleteAllRouteSnapshot(this.activatedRoute.snapshot).then(() => {
          this.tabService.clearTabs();
        });
      } else {
        this.tabService.refresh();
      }
    }
  }

    // 修改主题配置项
    changeThemeOptions(isTrue: boolean, type: SettingKey): void {
      // 非固定头部时，设置标签也不固定
      if (type === 'fixedHead' && !isTrue) {
        this._themesOptions['fixedTab'] = false;
      }
      this._themesOptions[type] = isTrue;
      this.setThemeOptions();

      // 如果不展示多标签，则要清空tab,以及已经被缓存的所有组件
      if (type === 'isShowTab') {
        if (!isTrue) {
          SimpleReuseStrategy.deleteAllRouteSnapshot(this.activatedRoute.snapshot).then(() => {
            this.tabService.clearTabs();
          });
        } else {
          this.tabService.refresh();
        }
      }
    }

  // Modify special themes, color weak themes, gray themes
  changeSpecialTheme(e: boolean, themeType: SpecialTheme): void {
    const name = this.doc.getElementsByTagName('html');
    const theme = fnFormatToHump(themeType);
    if (e) {
      this.rd2.addClass(name[0], themeType);
    } else {
      this.rd2.removeClass(name[0], themeType);
    }
    this._themesOptions[theme as SpecialThemeHump] = e;
    this.setThemeOptions();
  }

  initThemeOption(): void {
    this.isNightTheme$.pipe(first(), takeUntilDestroyed(this.destroyRef)).subscribe(res => (this._isNightTheme = res));
    this.themesOptions$.pipe(first(), takeUntilDestroyed(this.destroyRef)).subscribe(res => {
      this._themesOptions = res;
    });

    // Special mode theme transformation (color weak mode, gray mode)
    (['grey-theme', 'color-weak'] as SpecialTheme[]).forEach(item => {
      const specialTheme = fnFormatToHump(item);
      this.changeSpecialTheme(this._themesOptions[specialTheme as SpecialThemeHump], item);
    });

    this.modes.forEach(item => {
      item.isChecked = item.key === this._themesOptions.mode;
    });
    this.colors.forEach(item => {
      item.isChecked = item.color === this._themesOptions.color;
    });
    this.changePrimaryColor(this.colors.find(item => item.isChecked)!);
    this.themes.forEach(item => {
      item.isChecked = item.key === this._themesOptions.theme;
    });
  }

  ngOnInit(): void {
    this.initThemeOption();
  }

  dragEnd(): void {
    if (this.dragging) {
      setTimeout(() => {
        this.dragging = false;
      });
    }
  }
}
