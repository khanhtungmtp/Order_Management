import { Component, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { FormControl, NonNullableFormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, catchError, of } from 'rxjs';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { fnCheckForm } from '@app/_core/utilities/tools';
import { PasswordStrengthMeterComponent } from '@app/admin/shared/biz-components/password-strength-meter/password-strength-meter.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UserManagerService } from '@app/_core/services/user-manager/user-manager.service';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { UserPasswordChangeRequest } from '@app/_core/models/user-manager/userpasswordchangerequest';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { BasicConfirmModalComponent } from '@app/_core/utilities/base-modal';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TranslateModule, NzAlertModule, FormsModule, NzFormModule, ReactiveFormsModule, NzGridModule, NzInputModule, NzButtonModule, PasswordStrengthMeterComponent, NzIconModule]
})
export class ChangePasswordComponent extends BasicConfirmModalComponent{
  passwordVisible: boolean = false;
  errorMessage: string = '';
  compirePasswordVisible: boolean = false;
  readonly nzModalData: any = inject(NZ_MODAL_DATA);
  private fb = inject(NonNullableFormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private userManagerService = inject(UserManagerService);
  private translate = inject(TranslateService);
  override modalRef = inject(NzModalRef);
  get newPassword(): string {
    return this.validateForm.controls.newPassword.value!;
  }

  override getCurrentValue(): Observable<any> {
    if (!fnCheckForm(this.validateForm)) {
      return of(false);
    }

    const request: UserPasswordChangeRequest = {
      oldPassword: this.validateForm.value.oldPassword!,
      newPassword: this.validateForm.value.sureNewPassword!
    }

    return this.userManagerService.changePassword(this.nzModalData.userId, request).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  private handleError(error: any): Observable<NzSafeAny> {
    if (error.error && error.error.message) {
      this.errorMessage = error.error.message;
    } else {
      this.errorMessage = error.message;
    }
    this.cdr.detectChanges();
    return of(null);
  }

  confirmationValidator = (control: FormControl): { [s: string]: any } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.newPassword.value) {
      return { message: this.translate.instant('setting.changePassword.doNotMatch'), error: true };
    }
    return {};
  };
  validateForm = this.fb.group({
    oldPassword: [null, [Validators.required]],
    newPassword: [null, [Validators.required]],
    sureNewPassword: [null, [Validators.required, this.confirmationValidator]]
  });

  updateConfirmValidator(): void {
    Promise.resolve().then(() => this.validateForm.controls.sureNewPassword.updateValueAndValidity());
  }
}
