import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormGroup, FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { UrlRouteConstants } from '@constants/url-route.constants';
import { AuthService } from '@services/auth/auth.service';
import { InjectBase } from '@utilities/inject-base-app';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { fnCheckForm } from '@app/_core/utilities/tools';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [TranslateModule, FormsModule, NzFormModule, ReactiveFormsModule, NzAlertModule, NzTabsModule, NzGridModule, NzButtonModule, NzInputModule, NzWaveModule, NzCheckboxModule, NzIconModule, RouterLink, NzNotificationModule, TranslateModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent extends InjectBase implements OnInit {
  validateForm!: FormGroup;
  @Input() returnUrl: string = '';
  isCapsLockOn: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService,
    private translate: TranslateService,) {
    super();
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      userName: [''],
      password: [''],
      remember: [true]
    });
  }

  onKeyUp(event: KeyboardEvent): void {
    if (event.getModifierState && event.getModifierState('CapsLock')) {
      this.isCapsLockOn = true; // Caps Lock is on.
    } else {
      this.isCapsLockOn = false; // Caps Lock is off.
    }
  }

  login(): void {
    if (!fnCheckForm(this.validateForm)) {
      return;
    }
    const param = this.validateForm.getRawValue();
    this.spinnerService.show();
    this.authService.login(param).subscribe({
      next: (res) => {
        this.spinnerService.hide();
        if(res.token ==''){
          this.notification.error(this.translate.instant('system.caption.error'), this.translate.instant('system.message.logInFailed'));
          return;
        }
        this.notification.success(this.translate.instant('system.caption.success'), this.translate.instant('system.message.logedIn'));
        if (this.returnUrl)
          this.router.navigateByUrl(this.returnUrl);
        else
          this.router.navigate([UrlRouteConstants.DASHBOARD]);
      },
      error: (err) => {
        this.spinnerService.hide();
        throw err;
      },
    });

  }
}
