export class Validate {
  REGEX_STR = {
    number: `(([-+]?\\d+\\.\\d+)|([-+]?\\d+)|([-+]?\\.\\d+))(?:[eE]([-+]?\\d+))?`,
    url: `(((^https?:(?:\/\/)?)(?:[-;:&=\\+\\$,\\w]+@)?[A-Za-z0-9.-]+(?::\\d+)?|(?:www.|[-;:&=\\+\\$,\\w]+@)[A-Za-z0-9.-]+)((?:\/[\\+~%\\/.\\w-_]*)?\\??(?:[-\\+=&;%@.\\w_]*)#?(?:[\\w]*))?)`,
    ip: `(?:^(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}$)|(?:^(?:(?:[a-fA-F\\d]{1,4}:){7}(?:[a-fA-F\\d]{1,4}|:)|(?:[a-fA-F\\d]{1,4}:){6}(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|:[a-fA-F\\d]{1,4}|:)|(?:[a-fA-F\\d]{1,4}:){5}(?::(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,2}|:)|(?:[a-fA-F\\d]{1,4}:){4}(?:(?::[a-fA-F\\d]{1,4}){0,1}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,3}|:)|(?:[a-fA-F\\d]{1,4}:){3}(?:(?::[a-fA-F\\d]{1,4}){0,2}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,4}|:)|(?:[a-fA-F\\d]{1,4}:){2}(?:(?::[a-fA-F\\d]{1,4}){0,3}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,5}|:)|(?:[a-fA-F\\d]{1,4}:){1}(?:(?::[a-fA-F\\d]{1,4}){0,4}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,6}|:)|(?::(?:(?::[a-fA-F\\d]{1,4}){0,5}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,7}|:)))(?:%[0-9a-zA-Z]{1,})?$)`,
    color: `(?:#|0x)(?:[a-f0-9]{3}|[a-f0-9]{6})\\b|(?:rgb|hsl)a?\\([^\\)]*\\)`,
    isVietnamesePhoneNumber: `(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\\b`
  };

  REGEX = {
    number: genRegex(this.REGEX_STR.number),
    mobile: genRegex(this.REGEX_STR.isVietnamesePhoneNumber),
    url: genRegex(this.REGEX_STR.url),
    ip: genRegex(this.REGEX_STR.ip),
    color: genRegex(this.REGEX_STR.color)
  };

  /**
 * Wheter is number
 *
 */
  isNum(value: string | number): boolean {
    return this.REGEX.number.test(value.toString());
  }



  /**
   * Wheter is integer
   *
   */
  isInt(value: string | number): boolean {
    return this.isNum(value) && parseInt(value.toString(), 10).toString() === value.toString();
  }

  /**
   * Wheter is decimal
   *
   */
  isDecimal(value: string | number): boolean {
    return this.isNum(value) && !this.isInt(value);
  }


  /**
   * Wheter is china mobile (China)
   *
   */
  isMobile(value: string): boolean {
    return this.REGEX.mobile.test(value);
  }

  /**
   * Wheter is url address
   *
   */
  isUrl(url: string): boolean {
    return this.REGEX.url.test(url);
  }

  /**
   * Wheter is IPv4 address (Support v4, v6)
   *
   */
  isIp(ip: string): boolean {
    return this.REGEX.ip.test(ip);
  }

  /**
   * Wheter is color
   *
   */
  isColor(color: string): boolean {
    return this.REGEX.color.test(color);
  }
}


function genRegex(str: string, flags?: string): RegExp {
  return new RegExp(`^${str}$`, flags);
}
