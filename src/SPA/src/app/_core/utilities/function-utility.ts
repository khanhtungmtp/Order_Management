import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Pagination } from "./pagination-utility";
import { NzNotificationCustomService } from "@services/nz-notificationCustom.service";
import { NzSpinnerCustomService } from "@services/common/nz-spinner.service";
import { TranslateService } from "@ngx-translate/core";
import { AuthResponse } from "../models/auth/auth-response";
import { LocalStorageConstants } from "../constants/local-storage.constants";
interface TreeNode {
  id: string;
  parentId: string | null;
  children?: TreeNode[];
}
@Injectable({
  providedIn: "root",
})
export class FunctionUtility {
  /**
   *Hàm tiện ích
   */

  constructor(
    private snotify: NzNotificationCustomService,
    private spinnerService: NzSpinnerCustomService,
    private translateService:TranslateService
  ) { }

  /**
   *Trả ra ngày hiện tại, chỉ lấy năm tháng ngày: yyyy/MM/dd
   */
  getToDay() {
    const toDay =
      new Date().getFullYear().toString() +
      "/" +
      (new Date().getMonth() + 1).toString() +
      "/" +
      new Date().getDate().toString();
    return toDay;
  }

  /**
   *Trả ra ngày với tham số truyền vào là ngày muốn format, chỉ lấy năm tháng ngày: yyyy/MM/dd
   */
  getDateFormat(date: Date) {
    return (
      date.getFullYear() +
      "/" +
      (date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1) +
      "/" +
      (date.getDate() < 10 ? "0" + date.getDate() : date.getDate())
    );
  }

  /**
   *Trả ra ngày với tham số truyền vào là ngày muốn format string: yyyy/MM/dd HH:mm:ss
   */
  getDateTimeFormat(date: Date) {
    return (
      date.getFullYear() +
      "/" +
      (date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1) +
      "/" +
      (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) +
      " " +
      (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) +
      ":" +
      (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
      ":" +
      (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds())
    );
  }

  getUTCDate(d?: Date) {
    let date = d ? d : new Date();
    return new Date(
      Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
      )
    );
  }

  /**
   * Check 1 string có phải empty hoặc null hoặc undefined ko.
   */
  checkEmpty(str: string) {
    return !str || /^\s*$/.test(str);
  }

  /**
   * Kiểm tra số lượng phần ở trang hiện tại, nếu bằng 1 thì cho pageNumber lùi 1 trang
   * @param pagination
   */
  calculatePagination(pagination: Pagination) {
    // Kiểm tra trang hiện tại phải là trang cuối không và trang hiện tại không phải là trang 1
    if (
      pagination.pageNumber === pagination.totalPage &&
      pagination.pageNumber !== 1
    ) {
      // Lấy ra số lượng phần tử hiện tại của trang
      let currentItemQty =
        pagination.totalCount -
        (pagination.pageNumber - 1) * pagination.pageSize;

      // Nếu bằng 1 thì lùi 1 trang
      if (currentItemQty === 1) {
        pagination.pageNumber--;
      }
    }
  }

  /**
   * Thêm hoặc xóa class tác động vào id element trên DOM
   * * @param id
   * * @param className
   * * @param type => Value bằng true thì add class. Value bằng false thì xóa class
   */
  changeDomClassList(id: string, className: string, type: boolean) {
    const element = document.getElementById(id);
    if (element) {
      type ? element.classList.add(className) : element.classList.remove(className);
    } else {
      console.error(`Element with id '${id}' not found.`);
      // Handle the case when the element is not found, depending on your requirements.
    }
  }

  toFormData(obj: any, form?: FormData, namespace?: string) {
    let fd = form || new FormData();
    let formKey: string;
    for (var property in obj) {
      if (obj.hasOwnProperty(property)) {
        // namespaced key property
        if (!isNaN(property as any)) {
          // obj is an array
          formKey = namespace ? `${namespace}[${property}]` : property;
        } else {
          // obj is an object
          formKey = namespace ? `${namespace}.${property}` : property;
        }
        if (obj[property] instanceof Date) {
          // the property is a date, so convert it to a string
          fd.append(formKey, obj[property].toISOString());
        } else if (typeof obj[property] === 'object' && !(obj[property] instanceof File)) {
          // the property is an object or an array, but not a File, use recursivity
          this.toFormData(obj[property], fd, formKey);
        } else {
          // the property is a string, number or a File object
          fd.append(formKey, obj[property]);
        }
      }
    }
    return fd;
  }

  // excuteResult(res: OperationResult, success: string, error?: string, okCallback?: () => any, errorCallback?: () => any) {
  //   if (res.isSuccess) {
  //     this.spinnerService.hide();
  //     this.snotify.success(
  //       this.translateService.instant(success),
  //       this.translateService.instant('System.Caption.Success')
  //     );
  //     okCallback?.();
  //   } else {
  //     this.snotify.error(
  //       this.translateService.instant(res.error ?? error),
  //       this.translateService.instant('System.Caption.Error')
  //     );
  //     errorCallback?.();
  //     this.spinnerService.hide();
  //   }
  // }

  /**
   * Append property HttpParams
   * * @param formValue
   */
  toParams(formValue: any) {
    let params = new HttpParams();
    for (const key of Object.keys(formValue)) {
      const value = formValue[key];
      params = params.append(key, value);
    }
    return params;
  }

  exportExcel(result: Blob | string, fileName: string, type?: string) {
    if (typeof result === "string") {
      let byteCharacters = atob(result);
      let byteArrays = [];
      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        let slice = byteCharacters.slice(offset, offset + 512);
        let byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        let byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      result = new Blob(byteArrays, { type: 'application/xlsx' });
    }
    if (!type) type = 'xlsx';
    if (result.size == 0) {
      this.spinnerService.hide();
      return this.snotify.warning('No Data', 'Warning');
    }
    if (result.type !== `application/${type}`) {
      this.spinnerService.hide();
      return this.snotify.error(result.type.toString(), 'Error');
    }
    const blob = new Blob([result]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${fileName}.${type}`);
    document.body.appendChild(link);
    link.click();
  }

  print(result: Blob) {
    if (result.size == 0) {
      this.spinnerService.hide();
      return this.snotify.warning('No Data', "Warning")
    }
    const blob = new Blob([result], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = blobUrl;
    document.body.appendChild(iframe);
    iframe.contentWindow?.print();
  }

  capitalizeFirstLetter(input: string): string {
    return input.charAt(0).toUpperCase() + input.slice(1);
  }


  unflatteringForLeftMenu = <T extends TreeNode>(arr: T[]): T[] => {
    const map: Record<string, T> = {}; // Change map to Record<string, T>
    const roots: T[] = [];

    // First pass: Collect nodes into a map
    for (const node of arr) {
      node.children = []; // Initialize children array
      map[node.id] = node; // Store node in the map
    }

    // Second pass: Build tree structure
    for (const node of arr) {
      if (node.parentId && node.parentId !== "ROOT") {
        const parentNode = map[node.parentId];
        if (parentNode) {
          parentNode?.children?.push(node); // Add node to its parent's children array
        }
      } else {
        roots.push(node); // Add node to roots if it has no parent or its parent is "ROOT"
      }
    }
    return roots;
  }

  unflatteringForTree = (arr: any[]): any[] => {
    const map: Record<string, any> = {}; // Change map to Record<string, T>
    const roots: any[] = [];
    let node = {
      parentId: '',
      expanded: true,
      children: []
    };
    for (let i = 0; i < arr.length; i += 1) {
      map[arr[i].id] = i; // initialize the map
      arr[i].children = []; // initialize the children
    }
    for (let i = 0; i < arr.length; i += 1) {
      node = arr[i];
      if (node.parentId !== null && arr[map[node.parentId]] != undefined) {
        arr[map[node.parentId]].children.push(node);
      } else {
        roots.push(node);
      }
    }
    return roots;
  }

  createSlug(str: string): string {
    const VietNamChar = [
      "aAeEoOuUiIdDyY",
      "áàạảãâấầậẩẫăắằặẳẵ",
      "ÁÀẠẢÃÂẤẦẬẨẪĂẮẰẶẲẴ",
      "éèẹẻẽêếềệểễ",
      "ÉÈẸẺẼÊẾỀỆỂỄ",
      "óòọỏõôốồộổỗơớờợởỡ",
      "ÓÒỌỎÕÔỐỒỘỔỖƠỚỜỢỞỠ",
      "úùụủũưứừựửữ",
      "ÚÙỤỦŨƯỨỪỰỬỮ",
      "íìịỉĩ",
      "ÍÌỊỈĨ",
      "đ",
      "Đ",
      "ýỳỵỷỹ",
      "ÝỲỴỶỸ"
    ];

    // Thay thế và lọc dấu từng char
    for (let i = 1; i < VietNamChar.length; i++) {
      for (let j = 0; j < VietNamChar[i].length; j++) {
        str = str.replace(new RegExp(VietNamChar[i][j], 'g'), VietNamChar[0][i - 1]);
      }
    }

    // Loại bỏ các ký tự đặc biệt và khoảng trắng, chuyển về chữ thường và thay thế khoảng trắng bằng dấu gạch ngang
    str = str.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');

    return str;
  }

  getLocalStorageItem = <T>(key: string): T => JSON.parse(localStorage.getItem(key) as string);

  getLoggedInUser(): AuthResponse {
    return this.getLocalStorageItem<AuthResponse>(LocalStorageConstants.USER);
  }

  getProgramLoggedInUser(): string[] {
    const user = this.getLocalStorageItem<AuthResponse>(LocalStorageConstants.USER);
    return user?.permissions || [];
  }

  snotifySuccessError(isSuccessError: boolean, message: string) {
    this.snotify[isSuccessError ? 'success' : 'error'](
      this.translateService.instant(`system.caption.${isSuccessError ? 'success' : 'error'}`),
      this.translateService.instant(`${message}`)
    );
  }

  snotifySystemError() {
    this.spinnerService.hide();
    this.snotify.error(
      this.translateService.instant('system.caption.error'),
      this.translateService.instant('system.message.systemError')
    );
  }

}



