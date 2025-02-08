import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageConstants } from '@app/_core/constants/local-storage.constants';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { UrlRouteConstants } from '@app/_core/constants/url-route.constants';

export const RefreshTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.getToken()) return next(req);

  const cloned = req.clone({
    headers: req.headers.set(
      'Authorization',
      'Bearer ' + authService.getToken()
    ),
  });
  return next(cloned).pipe(
    catchError((err: HttpErrorResponse) => {
      console.log('err: ', err);
      if (err.status === 401) {
        authService
          .refreshToken()
          .subscribe({
            next: (response) => {
              if (response != null) {
                localStorage.setItem(LocalStorageConstants.TOKEN, response.token);
                localStorage.setItem(LocalStorageConstants.USER, JSON.stringify(response));
                const cloned = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${response.token}`,
                  },
                });
                location.reload();
              }
            },
            error: () => {
              authService.logout();
              router.navigate([UrlRouteConstants.LOGIN]);
            },
          });
      }
      return throwError(() => err);
    })
  );
};
