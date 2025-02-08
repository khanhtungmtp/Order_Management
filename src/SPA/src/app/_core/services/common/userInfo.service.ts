import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { JwtHelperService } from '@auth0/angular-jwt';
import { UserInformation } from '@app/_core/models/auth/userInformation';

export interface UserInfo {
  userId: number;
  authCode: string[];
}

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
  private userInfo$ = new BehaviorSubject<UserInfo>({ userId: -1, authCode: [] });

  parsToken(token: string) {
    const helper = new JwtHelperService();
    try {
      const abc = helper.decodeToken(token);
      console.log('abc: ', abc);
      // return {
      //   id,
      //   authCode: rol.split(',')
      // };
    } catch (e) {
      // return {
      //   userId: -1,
      //   authCode: []
      // };
    }
  }

  setUserInfo(userInfo: UserInfo): void {
    this.userInfo$.next(userInfo);
  }

  getUserInfo(): Observable<UserInfo> {
    return this.userInfo$.asObservable();
  }
}
