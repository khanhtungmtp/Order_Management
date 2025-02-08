// import { Injectable, ErrorHandler, inject, ChangeDetectorRef } from "@angular/core";
// import { HttpErrorResponse } from "@angular/common/http";
// import { ErrorGlobalResponse } from "@models/base/error-global-response";
// import { NzSpinnerCustomService } from "../services/common/nz-spinner.service";
// import { NzNotificationCustomService } from "../services/nz-notificationCustom.service";
// import { environment } from '@env/environment';
// import { Router } from "@angular/router";
// import { UrlRouteConstants } from "../constants/url-route.constants";
// import { AuthService } from "../services/auth/auth.service";
// @Injectable({
//   providedIn: "root",
// })
// export class GlobalErrorHandler implements ErrorHandler {
//   private notification = inject(NzNotificationCustomService);
//   private spinnerService = inject(NzSpinnerCustomService);
//   private router = inject(Router);
//   private authService = inject(AuthService);
//   isProduct: boolean = environment.production

//   handleError(error: any) {
//     console.log('error global: ', error);
//     let apiError: ErrorGlobalResponse = <ErrorGlobalResponse>{
//       message: 'An error occurred while connecting to the server',
//       statusCode: error.status,
//       type: error.name
//     };

//     if (error instanceof HttpErrorResponse) {
//       if (error.status === 0) {
//         apiError.message = "Cannot connect to the server";
//       }
//       else if (error.status === 403) {
//         apiError.message = "You are not authorized to view this page";
//         this.authService.logout();
//         this.router.navigate([UrlRouteConstants.LOGIN]);
//         this.spinnerService.hide();
//         this.notification.error('Error: ' + apiError.statusCode, apiError.message)
//         return;
//       }
//       else if (error.status === 400) {
//         console.log('errors servers 400:', error);
//         this.notification.error('Error: ' + apiError.statusCode, apiError.message)
//         return;
//       }
//       else if (error.error) {
//         if (error.error?.type === 'ValidatorError') {
//           apiError = {
//             message: this.isProduct ? "Sorry, there is an error on server." : error.error?.errors.join('\n') || apiError.message,
//             statusCode: error.error.statusCode || apiError.statusCode,
//             type: error.error.type || apiError.type
//           };
//         } else {
//           apiError = {
//             message: this.isProduct ? "Sorry, there is an error on server." : error.error.message || apiError.message,
//             statusCode: error.error.statusCode || apiError.statusCode,
//             type: error.error.type || apiError.type
//           };
//         }

//         console.log('errors servers include error.error:', apiError);
//       } else {
//         apiError.message = this.isProduct ? "Sorry, there is an error on server." : error.message;
//         console.log('errors servers:', apiError);
//       }

//     } else {
//       // Lỗi client-side hoặc lỗi mạng
//       // custom exception error APIError
//       if (error.error?.errors) {
//         apiError = {
//           message: error.error.errors.join(','),
//           statusCode: error.error.status,
//           type: error.error.type
//         }
//         console.log('errors dev: uncorect field parameter: ', apiError);
//         return;
//       } else {
//         apiError = {
//           message: error.error?.message ?? error.message,
//           statusCode: error?.status ?? 400,
//           type: error?.name ?? 'Error dev'
//         }
//         console.log('errors dev:', apiError);
//       }
//     }

//     this.spinnerService.hide();
//     this.notification.error('Error: ' + apiError.statusCode, apiError.message)
//   }
// }


import { Injectable, ErrorHandler } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { ErrorGlobalResponse } from "@models/base/error-global-response";
import { NzNotificationCustomService } from "../services/nz-notificationCustom.service";
import { environment } from '@env/environment';
import { NzSpinnerCustomService } from "../services/common/nz-spinner.service";
import { AuthService } from "../services/auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class GlobalErrorHandler implements ErrorHandler {
  isProduct: boolean = environment.production;

  constructor(
    private notification: NzNotificationCustomService,
    private authService: AuthService,
    private spinnerService: NzSpinnerCustomService) { }

  handleError(error: any) {
    console.warn('GlobalErrorHandler: Error occurred', error);

    let apiError: ErrorGlobalResponse;

    if (error instanceof HttpErrorResponse) {
      apiError = this.handleServerSideError(error);

      // if (error.status === 403 || error.status === 401) {
      //   this.authService.logout();
      // }
      // else
      // Handle other HttpErrorResponse cases if needed
    } else {
      apiError = this.handleClientSideError(error);
    }
    this.spinnerService.hide();
    this.handleErrorWithNotification(apiError);
  }

  private handleServerSideError(error: HttpErrorResponse): ErrorGlobalResponse {
    const defaultMessage = "Sorry, there is an error on server.";
    const isValidatorError: boolean = error.error?.type === 'ValidatorError';
    const errorMessage = this.isProduct || !error.error?.message
      ? defaultMessage
      : isValidatorError
        ? error.error?.errors.join('\n')
        : error.error.message;

    return {
      message: errorMessage,
      statusCode: error.status,
      type: error.name
    };
  }

  private handleClientSideError(error: any): ErrorGlobalResponse {
    const message = error.error?.message ?? error.message ?? "An unknown error occurred.";
    return {
      message,
      statusCode: error?.status ?? 400,
      type: error?.name ?? 'Error'
    };
  }

  private handleErrorWithNotification(apiError: ErrorGlobalResponse) {
    this.notification.error(`Error: ${apiError.statusCode}`, apiError.message);
  }

}
