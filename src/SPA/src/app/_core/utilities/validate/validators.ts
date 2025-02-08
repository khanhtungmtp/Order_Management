import { AbstractControl, ValidationErrors } from '@angular/forms';

import { isDecimal, isIdCard, isInt, isMobile, isNum, isUrl } from './validate';

/** A set of daily validators */
export class _Validators {
  /** Whether it is a number */
  static num(control: AbstractControl): ValidationErrors | null {
    return isNum(control.value) ? null : { num: true };
  }

  /** Whether it is an integer */
  static int(control: AbstractControl): ValidationErrors | null {
    return isInt(control.value) ? null : { int: true };
  }

  /** Whether it is a decimal */
  static decimal(control: AbstractControl): ValidationErrors | null {
    return isDecimal(control.value) ? null : { decimal: true };
  }

  /** Whether it is an ID card */
  static idCard(control: AbstractControl): ValidationErrors | null {
    return isIdCard(control.value) ? null : { idCard: true };
  }

  /** Whether it is a mobile phone number */
  static mobile(control: AbstractControl): ValidationErrors | null {
    return isMobile(control.value) ? null : { mobile: true };
  }

  /** Whether the URL address */
  static url(control: AbstractControl): ValidationErrors | null {
    return isUrl(control.value) ? null : { url: true };
  }
}
