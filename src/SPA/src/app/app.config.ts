import { APP_INITIALIZER, ApplicationConfig, ErrorHandler, importProvidersFrom, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { TitleStrategy, provideRouter, withComponentInputBinding, withHashLocation, withInMemoryScrolling, withPreloading } from '@angular/router';

import { routes } from './app.routes';
import { provideNzIcons } from './icons-provider';
import { provideNzI18n, NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import vi from '@angular/common/locales/vi';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { GlobalErrorHandler } from '@utilities/global-error-handler';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SelectivePreloadingStrategyService } from '@services/common/selective-preloading-strategy.service';
import { InitThemeService } from '@services/common/init-theme.service';
import { ThemeSkinService } from '@services/common/theme-skin.service';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { CustomPageTitleResolverService } from '@services/common/custom-page-title-resolver.service';
import { DashboardOutline, FormOutline, MenuFoldOutline, MenuUnfoldOutline, DollarCircleOutline } from '@ant-design/icons-angular/icons';
import { LoadAliIconCdnService } from '@services/common/load-ali-icon-cdn.service';
import { SubLockedStatusService } from '@services/common/sub-locked-status.service';
import { SubWindowWithService } from '@services/common/sub-window-with.service';
import { TokenInterceptor } from './_core/services/auth/token.interceptor';
import { LocalStorageConstants } from './_core/constants/local-storage.constants';
const icons = [MenuFoldOutline, MenuUnfoldOutline, DashboardOutline, FormOutline, DollarCircleOutline];
registerLocaleData(vi);
export const langDefault = localStorage.getItem(LocalStorageConstants.LANG) || 'en_US';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

// export function StartupServiceFactory(startupService: CommonService) {
//   return () => startupService.load();
// }

export function LoadAliIconCdnFactory(loadAliIconCdnService: LoadAliIconCdnService) {
  return () => loadAliIconCdnService.load();
}

export function InitThemeServiceFactory(initThemeService: InitThemeService) {
  return async (): Promise<void> => await initThemeService.initTheme();
}

// Surveillance lock screen status
export function InitLockedStatusServiceFactory(subLockedStatusService: SubLockedStatusService) {
  return () => subLockedStatusService.initLockedStatus();
}

// // Open the width of the monitoring screen
export function SubWindowWithServiceFactory(subWindowWithService: SubWindowWithService) {
  return () => subWindowWithService.subWindowWidth();
}

const APPINIT_PROVIDES = [
  // Project begining
  // {
  //   provide: APP_INITIALIZER,
  //   useFactory: StartupServiceFactory,
  //   deps: [CommonService],
  //   multi: true
  // },
  // Initialized lock screen service
  {
    provide: APP_INITIALIZER,
    useFactory: InitLockedStatusServiceFactory,
    deps: [SubLockedStatusService],
    multi: true
  },
  // Initialization theme
  {
    provide: APP_INITIALIZER,
    useFactory: InitThemeServiceFactory,
    deps: [InitThemeService],
    multi: true
  },
  // Initialization supervision listening screen width service
  {
    provide: APP_INITIALIZER,
    useFactory: SubWindowWithServiceFactory,
    deps: [SubWindowWithService],
    multi: true
  },
  // Initialize the dark mode is also the CSS of the Default mode
  {
    provide: APP_INITIALIZER,
    useFactory: (themeService: ThemeSkinService) => () => {
      return themeService.loadTheme();
    },
    deps: [ThemeSkinService],
    multi: true
  }
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withPreloading(SelectivePreloadingStrategyService), // Custom module pre -load
      // withViewTransitions({
      //   skipInitialTransition: true
      // }), // Routing switching transition, ng17 new experimental feature reference material https://netbasal.com/angular-v17s-view-transitions-navigate-in-elegance-f2d48fd8ceda
      withInMemoryScrolling({
        scrollPositionRestoration: 'top'
      }),
      withHashLocation(), // Use hash routing
      withComponentInputBinding() // Enable routing parameters to be bound to the input attributes of the component, a new feature in ng16
    ), provideNzIcons(), provideNzI18n(en_US),
    importProvidersFrom(FormsModule, NzDrawerModule, NzModalModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
        defaultLanguage: langDefault
      }),
    ), provideAnimationsAsync(), provideHttpClient(
      // withInterceptors([RefreshTokenInterceptor]),
      // DI-based interceptors must be explicitly enabled.
      withInterceptorsFromDi(),
    ),
    provideExperimentalZonelessChangeDetection(), // 开启 zoneless
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    ...APPINIT_PROVIDES,
    // { provide: RouteReuseStrategy, useClass: SimpleReuseStrategy, deps: [DOCUMENT, ScrollService] }, // Reuse tab
    {
      provide: TitleStrategy, //Relevant information：https://dev.to/brandontroberts/setting-page-titles-natively-with-the-angular-router-393j
      useClass: CustomPageTitleResolverService // When custom routing switching, the browser Title display, support above NG14. Please see my GitHub V16TAG below code for the old version.
    },
    { provide: NZ_I18N, useValue: en_US }, // zorro internationalization
    { provide: NZ_ICONS, useValue: icons }, // Zorro icon
  ]
};
