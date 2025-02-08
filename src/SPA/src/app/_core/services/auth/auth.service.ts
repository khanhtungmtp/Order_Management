import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStorageConstants } from '@constants/local-storage.constants';
import { UrlRouteConstants } from '@constants/url-route.constants';
import { TokenRequest } from '@app/_core/models/auth/token-request';
import { UserForLogged, UserForLoggedIn, UserLoginParam } from '@models/auth/auth';
import { map } from 'rxjs/operators';
import { BaseHttpService } from '../base-http.service';
import { WindowService } from '../common/window.service';
import { UserInformation } from '@app/_core/models/auth/userInformation';
import { AuthResponse } from '@app/_core/models/auth/auth-response';
import { SimpleReuseStrategy } from '../common/reuse-strategy';
import { TabService } from '../common/tab.service';
import { MenuStoreService } from '../common/menu-store.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public profileUser: UserInformation = <UserInformation>{};
  jwtHelper = new JwtHelperService();

  constructor(
    private httpBase: BaseHttpService,
    private windowServe: WindowService,
    private activatedRoute: ActivatedRoute,
    private menuService: MenuStoreService,
    private router: Router,
    private tabService: TabService) { }

  login(param: UserLoginParam) {
    return this.httpBase.post<UserForLoggedIn>('Auth/login', param).pipe(map(response => {
      // except 2 field token, refreshToken
      const { token, refreshToken, ...otherProps } = response;
      this.profileUser = { ...otherProps }
      this.setToken(response.token);
      this.setRefreshToken(response.refreshToken);
      this.setUserProfile(this.profileUser);
      return response
    }))
  }

  getPasswordReset(Account: string) {
    return this.httpBase.get<Boolean>('Auth/GetPasswordReset', Account);
  }

  async clearTabCash(): Promise<void> {
    await SimpleReuseStrategy.deleteAllRouteSnapshot(this.activatedRoute.snapshot);
    return await new Promise(resolve => {
      // clear tab
      this.tabService.clearTabs();
      resolve();
    });
  }

  async clearSessionCash(): Promise<void> {
    return new Promise(resolve => {
      this.menuService.setMenuArrayStore([]);
      resolve();
    });
  }

  private async loginOut(): Promise<void> {
    await this.clearTabCash();
    await this.clearSessionCash();
    this.router.navigate([UrlRouteConstants.LOGIN]);
  }

  logout(): void {
    // Lưu giữ giá trị của key mà không muốn xóa
    const savedThemeOptionsKeyOld = localStorage.getItem(LocalStorageConstants.ThemeOptionsKey);
    const savedLangOld = localStorage.getItem(LocalStorageConstants.LANG);

    this.windowServe.clearStorage();
    this.windowServe.clearSessionStorage();
    if (savedThemeOptionsKeyOld) {
      localStorage.setItem(LocalStorageConstants.ThemeOptionsKey, savedThemeOptionsKeyOld);
    }
    if (savedLangOld) {
      localStorage.setItem(LocalStorageConstants.LANG, savedLangOld);
    }
    this.loginOut().then();
  }

  refreshToken() {
    const tokenRequest: TokenRequest = {
      refreshToken: this.getRefreshToken() as string,
      email: this.getEmail() as string,
      token: this.getToken() as string
    }
    return this.httpBase.post<AuthResponse>('Auth/refresh-token', tokenRequest);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token')
  }

  // handle
  public setToken(token: string): void {
    localStorage.setItem(LocalStorageConstants.TOKEN, token);
  };

  public setRefreshToken(refreshToken: string): void {
    localStorage.setItem(LocalStorageConstants.REFRESH_TOKEN, refreshToken);
  };

  public setUserProfile(user: UserInformation): void {
    localStorage.setItem(LocalStorageConstants.USER, JSON.stringify(user));
  }

  public getRefreshToken = (): string | null => {
    return localStorage.getItem(LocalStorageConstants.REFRESH_TOKEN);
  };

  public getToken = (): string | null => {
    return localStorage.getItem(LocalStorageConstants.TOKEN);
  };

  public getEmail = (): string => {
    const user: UserForLogged = JSON.parse(localStorage.getItem(LocalStorageConstants.USER) as string);
    return user.email as string;
  };

  public getUserProfile = () => {
    const user: UserInformation = JSON.parse(localStorage.getItem(LocalStorageConstants.USER) as string);
    return user;
  };

  public isTokenExpired() {
    return !!this.getToken() && this.jwtHelper.isTokenExpired(this.getToken());
  }
}
