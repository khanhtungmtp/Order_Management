import { Injectable } from "@angular/core";
import { NzNotificationService } from 'ng-zorro-antd/notification';
@Injectable({ providedIn: 'root' })
export class NzNotificationCustomService {

  constructor(private notification: NzNotificationService) { }

  success(title: string, content: string) {
    this.notification.create(
      'success',
      title,
      content
    );
  }

  error(title: string, content: string) {
    this.notification.create(
      'error',
      title,
      content
    );
  }

  warning(title: string, content: string) {
    this.notification.create(
      'warning',
      title,
      content
    );
  }

  info(title: string, content: string) {
    this.notification.create(
      'info',
      title,
      content
    );
  }


}
