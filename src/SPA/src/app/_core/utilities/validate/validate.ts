/** Whether it is a number */
export function isNum(value: string | number): boolean {
  return /^((-?\d+\.\d+)|(-?\d+)|(-?\.\d+))$/.test(value.toString());
}

/** Whether it is an integer */
export function isInt(value: string | number): boolean {
  return isNum(value) && parseInt(value.toString(), 10).toString() === value.toString();
}

/** Whether it is a decimal */
export function isDecimal(value: string | number): boolean {
  return isNum(value) && !isInt(value);
}

/** Whether it is an ID card */
export function isIdCard(value: string): boolean {
  return /(^\d{15}$)|(^\d{17}([0-9]|X)$)/i.test(value);
}

/** Whether it is a mobile phone number */
export function isMobile(value: string): boolean {
  return /^(03|05|07|08|09|01(2|6|8|9))[0-9]{8}\b$/.test(value);
}

/** Whether the email address */
export function isEmail(value: string): boolean {
  return /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(value);
}

/** The password consists of 6 to 20 uppercase and lowercase letters */
export function isPasswordPass(value: string): boolean {
  const regTure = /^[^\s]{6,20}$/;
  const regFalse = /^\d+$/;
  return regTure.test(value) && !regFalse.test(value);
}

/** Whether the URL address */
export function isUrl(url: string): boolean {
  return /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/.test(url);
}
