import { inject, Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { ValidatorsRuleService } from './validators-rule.service';

@Injectable({
  providedIn: 'root'
})
export class ValidatorsService {
  private vrService = inject(ValidatorsRuleService);

  // Email verification
  public emailValidator(): ValidatorFn | null {
    return this.commonUtil(this.vrService.emailRule);
  }

  // Mobile phone number verification
  public mobileValidator(): ValidatorFn | null {
    return this.commonUtil(this.vrService.mobileRule);
  }

  // Password verification
  public passwordValidator(): ValidatorFn | null {
    return this.commonUtil(this.vrService.passwordRule);
  }


  private commonUtil(ruleFun: (value: string) => ValidationErrors | null): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return ruleFun(control.value);
    };
  }
}
