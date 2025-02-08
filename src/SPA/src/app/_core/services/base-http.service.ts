import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '@env/environment';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HttpCustomConfig, OperationResult } from '../utilities/operation-result';
import { Router } from '@angular/router';
import { NzSpinnerCustomService } from './common/nz-spinner.service';

@Injectable({
  providedIn: 'root'
})
export class BaseHttpService {
  uri: string;
  http = inject(HttpClient);
  message = inject(NzMessageService);
  router = inject(Router);
  spinnerService = inject(NzSpinnerCustomService);

  protected constructor() {
    this.uri = !environment.production ? environment.apiUrl : 'https://localhost:6001/api/';
  }

  // Modify your service methods
  get<T>(path: string, param?: NzSafeAny, config?: HttpCustomConfig): Observable<T> {
    config = config || { needSuccessInfo: false, typeAction: 'view', sendCookie: false };
    let reqPath = this.getUrl(path, config);

    // Loại bỏ các thuộc tính có giá trị là rỗng hoặc null từ tham số param
    const filteredParams = param ? this.removeEmptyProperties(param) : {};
    const params = new HttpParams({ fromObject: filteredParams });
    const requestOptions = this.getRequestOptions(config);

    return this.http.get<OperationResult>(reqPath, { params, ...requestOptions }).pipe(
      tap(() => this.handleSuccessNotification(config)),
      map(response => this.handleResponse(response)),
      catchError(this.handleError)
    );
  }

  delete<T>(path: string, body?: NzSafeAny, queryParams?: NzSafeAny, config?: HttpCustomConfig): Observable<T> {
    config = config || { needSuccessInfo: true, typeAction: 'delete', sendCookie: false };
    let reqPath = this.getUrl(path, config);

    // Chuyển đổi queryParams thành HttpParams
    const params = queryParams ? new HttpParams({ fromObject: queryParams }) : new HttpParams();

    const options = {
      params: params,
      body: body,
      ...config, // Bổ sung thêm cấu hình nếu có
    };

    // Sử dụng http.delete với RequestOptions bao gồm cả params và body
    return this.http.delete<OperationResult>(reqPath, options).pipe(
      tap(() => this.handleSuccessNotification(config)),
      map(response => this.handleResponse(response)),
      catchError(this.handleError)
    );
  }

  post<T>(path: string, param?: NzSafeAny, config?: HttpCustomConfig): Observable<T> {
    config = config || { needSuccessInfo: false, typeAction: 'add', sendCookie: false };
    let reqPath = this.getUrl(path, config);
    return this.http.post<OperationResult>(reqPath, param, this.getRequestOptions(config)).pipe(
      tap(() => this.handleSuccessNotification(config)),
      map(response => this.handleResponse(response)),
      catchError(this.handleError)
    );
  }

  put<T>(path: string, param?: NzSafeAny, config?: HttpCustomConfig): Observable<T> {
    config = config || { needSuccessInfo: false, typeAction: 'edit', sendCookie: false };
    let reqPath = this.getUrl(path, config);
    return this.http.put<OperationResult>(reqPath, param, this.getRequestOptions(config)).pipe(
      tap(() => this.handleSuccessNotification(config)),
      map(response => this.handleResponse(response)),
      catchError(this.handleError)
    );
  }

  patch<T>(path: string, param?: NzSafeAny, config?: HttpCustomConfig): Observable<T> {
    config = config || { needSuccessInfo: false, typeAction: 'edit', sendCookie: false };
    let reqPath = this.getUrl(path, config);
    return this.http.patch<OperationResult>(reqPath, param, this.getRequestOptions(config)).pipe(
      tap(() => this.handleSuccessNotification(config)),
      map(response => this.handleResponse(response)),
      catchError(this.handleError)
    );
  }

  downLoadWithBlob(path: string, param?: NzSafeAny, config?: HttpCustomConfig): Observable<NzSafeAny> {
    config = config || { needSuccessInfo: false, typeAction: 'download', sendCookie: false };
    let reqPath = this.getUrl(path, config);
    return this.http.post(reqPath, param, {
      responseType: 'blob',
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
      ...config
    }).pipe(tap(() => this.handleSuccessNotification(config)));
  }

  private getUrl(path: string, config: HttpCustomConfig): string {
    let reqPath = this.uri + path;
    if (config.otherUrl) {
      reqPath = path;
    }
    return reqPath;
  }

  private getRequestOptions(config: HttpCustomConfig): { headers?: HttpHeaders, withCredentials?: boolean } {
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json');
    const requestOptions: { headers?: HttpHeaders, withCredentials?: boolean } = {
      headers,
      withCredentials: config && config.sendCookie ? true : false
    };

    return requestOptions;
  }

  private removeEmptyProperties(obj: any): any {
    const newObj: any = {};
    Object.keys(obj).forEach(key => {
      if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
        newObj[key] = obj[key];
      }
    });
    return newObj;
  }

  private handleError(error: any) {
      console.log('An error occurred baseServices:', error);

    // Tiếp tục truyền lỗi tới global error handler
    return throwError(() => error);
  }

  // handle success
  private handleResponse<T>(response: OperationResult<T>): T | boolean {
    if (response.succeeded) {
      // Kiểm tra nếu có dữ liệu, trả về dữ liệu đó
      if (response.data !== undefined) {
        return response.data;
      }
      // Nếu không có dữ liệu nhưng vẫn thành công, log hoặc thực hiện một hành động nào đó
      else {
        return true;
      }
    } else {
      throw response.message;
    }
  }

  // Hàm mới để xử lý thông báo thành công
  private handleSuccessNotification(config: HttpCustomConfig): void {
    if (config.needSuccessInfo) {
      switch (config.typeAction) {
        case 'download':
          this.message.success('Downloaded successfully');
          break;
        case 'add':
          this.message.success('Created successfully');
          break;
        case 'edit':
          this.message.success('Updated successfully');
          break;
        case 'delete':
          this.message.success('Deleted successfully');
          break;
        default:
          break;
      }
    }
  }

}
