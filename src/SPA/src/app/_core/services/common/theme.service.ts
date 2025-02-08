import { Injectable } from '@angular/core';
import { Theme, ThemeMode } from '@app/admin/layouts/setting-drawer/setting-drawer.component';
import { BehaviorSubject, Observable } from 'rxjs';

export interface SettingInterface {
  theme: Theme['key']; // Theme mode (dark mode, light mode)
  color: string; // Màu chủ đề
  mode: ThemeMode['key']; // Chế độ menu (bên cạnh, trên cùng, kết hợp)
  colorWeak: boolean; // Mù màu
  greyTheme: boolean; // Chủ đề xám
  fixedHead: boolean; // Đầu cố định
  splitNav: boolean; // Phân chia menu (chỉ có hiệu lực khi chế độ menu là kết hợp)
  fixedLeftNav: boolean; // Menu bên trái cố định
  isShowTab: boolean; // Hiển thị tab nhiều trang
  fixedTab: boolean; // Tab cố định
  hasTopArea: boolean; // Có vùng trên cùng
  hasFooterArea: boolean; // Có vùng dưới cùng
  hasNavArea: boolean; // Có menu
  hasNavHeadArea: boolean; // Menu có đầu menu
}

export type StyleTheme = 'default' | 'dark' | 'aliyun' | 'compact'; // Chủ đề mặc định, chủ đề tối, chủ đề Alibaba Cloud, chủ đề gọn nhẹ

// Theme style
export type StyleThemeInterface = {
  [key in StyleTheme]: boolean;
};

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isNightTheme$ = new BehaviorSubject<boolean>(false);// Dark theme observable
  private isCompactTheme$ = new BehaviorSubject<boolean>(false); // Compact theme
  private isOverModeTheme$ = new BehaviorSubject<boolean>(false); // over mode, tức là kéo chiều rộng của trình duyệt cho đến khi thanh menu biến mất
  private themesMode$ = new BehaviorSubject<SettingInterface>({
    theme: 'dark',
    color: '#1890FF',
    mode: 'side',
    isShowTab: true,
    colorWeak: false,
    greyTheme: false,
    splitNav: false,
    fixedTab: true,
    fixedHead: true,
    fixedLeftNav: true,
    hasTopArea: true,
    hasFooterArea: true,
    hasNavArea: true,
    hasNavHeadArea: true
  });
  private styleThemeMode$ = new BehaviorSubject<StyleTheme>('default'); // Theme style, dark, default, compact, Alibaba Cloud
  private isCollapsed$ = new BehaviorSubject<boolean>(false); // Chế độ thu gọn Menu, kéo trình duyệt vào menu và tự động rút gọn thành biểu tượng

// Get the theme parameters
  setThemesMode(mode: SettingInterface): void {
    this.themesMode$.next(mode);
  }

  getThemesMode(): Observable<SettingInterface> {
    return this.themesMode$.asObservable();
  }

  // Get the theme mode
  setStyleThemeMode(mode: StyleTheme): void {
    this.setIsNightTheme(mode === 'dark');
    this.setIsCompactTheme(mode === 'compact');
    this.styleThemeMode$.next(mode);
  }

  getStyleThemeMode(): Observable<StyleTheme> {
    return this.styleThemeMode$.asObservable();
  }
// Is the theme a dark theme?
  setIsNightTheme(isNight: boolean): void {
    this.isNightTheme$.next(isNight);
  }

  getIsNightTheme(): Observable<boolean> {
    return this.isNightTheme$.asObservable();
  }

// Is the theme a compact theme?
  setIsCompactTheme(isNight: boolean): void {
    this.isCompactTheme$.next(isNight);
  }

  getIsCompactTheme(): Observable<boolean> {
    return this.isCompactTheme$.asObservable();
  }

// Liệu chủ đề có nằm ngoài thanh bên hay không
  setIsOverMode(isNight: boolean): void {
    this.isOverModeTheme$.next(isNight);
  }

  getIsOverMode(): Observable<boolean> {
    return this.isOverModeTheme$.asObservable();
  }

// Menu có bị thu gọn hay không
  setIsCollapsed(isCollapsed: boolean): void {
    this.isCollapsed$.next(isCollapsed);
  }

  getIsCollapsed(): Observable<boolean> {
    return this.isCollapsed$.asObservable();
  }
}
