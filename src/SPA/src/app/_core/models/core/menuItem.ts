// export class MenuItem {

//   module!: string;

//   children?: MenuItem[] = [];

//   title!: string;

//   isGroup?: boolean;

//   icon!: string;

//   isOpen = false;
// }

export interface MenuItem {
  title: string;
  url: string;
  icon?: string;
  children?: MenuItem[];
  expanded?: boolean; // Nếu expanded là tùy chọn
}

