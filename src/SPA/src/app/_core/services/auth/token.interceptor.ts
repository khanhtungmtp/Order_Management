import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, } from '@angular/common/http';
import { Observable, catchError, from, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { AuthResponse } from '@app/_core/models/auth/auth-response';

/**
 * @author Bakht Munir
 * @description Used to add token to request in header
 */

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const tokenResponse: AuthResponse = <AuthResponse>{
      token: this.authService.getToken()!,
      refreshToken: this.authService.getRefreshToken()!,
    }

    if (tokenResponse.token != null) {
      try {
        request = request.clone({
          setHeaders: {
            Authorization: 'Bearer ' + tokenResponse.token,
          },
        });
      } catch (exception) { }
    }
    // return next.handle(request);
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error?.status == 401) {
          return this.refreshTokenMethod(request, next);
        } else {
          return throwError(() => error);
        }
      })
    );
  }

  refreshTokenMethod(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.authService.refreshToken()).pipe(
      switchMap((res: AuthResponse) => {
        this.authService.setToken(res.token);
        this.authService.setRefreshToken(res.refreshToken);
        request = request.clone({
          setHeaders: {
            Authorization: 'Bearer ' + res.token,
          },
        });
        return next.handle(request);
      }),
      catchError((error) => {
        //Refresh Token Issue.
        if (error.status == 403) {
          this.authService.logout();
        }
        return throwError(() => error);
      })
    );
  }

}
