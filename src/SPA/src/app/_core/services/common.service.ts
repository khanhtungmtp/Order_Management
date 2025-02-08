import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment'
import { KeyValuePair } from '@utilities/key-value-pair';
import { AuthService } from './auth/auth.service';
import { UserInfoService } from './common/userInfo.service';
@Injectable({
  providedIn: 'root'
})
export class CommonService {
  // private loginInOutService = inject(LoginInOutService);

  private authService = inject(AuthService);
  private userService = inject(UserInfoService);

  load(): Promise<void> {
    const token = this.authService.getToken();
    if (token) {
      this.userService.parsToken(token);
      // return this.loginInOutService.loginIn(token);
    }
    return new Promise(resolve => {
      return resolve();
    });
  }
}

