import { NgTemplateOutlet } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, inject, ChangeDetectorRef, DestroyRef } from '@angular/core';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ModalOptions, NzModalService } from 'ng-zorro-antd/modal';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

import { HomeNoticeComponent } from '../home-notice/home-notice.component';
import { ScreenLessHiddenDirective } from '@app/admin/shared/directives/screen-less-hidden.directive';
import { ToggleFullscreenDirective } from '@app/admin/shared/directives/toggle-fullscreen.directive';
import { ModalBtnStatus } from '@app/_core/utilities/base-modal';
import { ChangePasswordService } from '@app/admin/pages/change-password/change-password.service';
import { LockWidgetService } from '@app/admin/tpl/lock-widget/lock-widget.service';
import { SearchRouteService } from '@app/admin/tpl/search-route/search-route.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LocalStorageConstants } from '@app/_core/constants/local-storage.constants';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { SystemLanguageService } from '@app/_core/services/system/system-language.service';
import { SystemLanguageVM } from '@app/_core/models/system/systemlanguagevm';
import { LangConstants } from '@app/_core/constants/lang-constants';
import { AuthService } from '@app/_core/services/auth/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserForLoggedIn } from '@app/_core/models/auth/auth';

@Component({
  selector: 'app-layout-head-right-menu',
  templateUrl: './layout-head-right-menu.component.html',
  styleUrls: ['./layout-head-right-menu.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgTemplateOutlet, ScreenLessHiddenDirective, NzToolTipModule, NzAvatarModule, NzIconModule, NzButtonModule, ToggleFullscreenDirective, NzDropDownModule, NzBadgeModule, NzMenuModule, HomeNoticeComponent, TranslateModule]
})
export class LayoutHeadRightMenuComponent implements OnInit {
  listLanguage: SystemLanguageVM[] = [];
  currentLang: string = '';
  currentImageLange: string = '';
  baseImage: string = "../../../../assets/images/lang/";
  account:UserForLoggedIn= JSON.parse(localStorage.getItem(LocalStorageConstants.USER) ?? "{}") || null;
  private changePasswordModalService = inject(ChangePasswordService);
  private authService = inject(AuthService);
  private lockWidgetService = inject(LockWidgetService);
  private searchRouteService = inject(SearchRouteService);
  private message = inject(NzMessageService);
  private translate = inject(TranslateService);
  private languageService = inject(SystemLanguageService);
  private cdr = inject(ChangeDetectorRef);
  private modalSrv = inject(NzModalService);
  private destroyRef = inject(DestroyRef);
  // lock screen
  lockScreen(): void {
    this.lockWidgetService
      .show({
        nzTitle: this.translate.instant('system.caption.lockScreen'),
        nzStyle: { top: '25px' },
        nzWidth: '520px',
        nzFooter: null,
        nzMaskClosable: true
      })
      .subscribe();
  }

  // change Password
  changePassword(): void {
    const userId = this.authService.getUserProfile().id
    this.changePasswordModalService
      .show({ nzTitle: this.translate.instant('system.caption.changePassword') }, { userId })
      .subscribe(({ modalValue, status }) => {
        if (status === ModalBtnStatus.Cancel) {
          return;
        }

        if (modalValue) {
          this.translate.get(['system.caption.warning', 'system.message.changePasswordOKMsg', 'setting.changePassword.changePasswordOk']).subscribe(translations => {
            const warnTitle = translations['system.caption.warning'];
            const content = translations['setting.changePassword.changePasswordOk'];
            const okMsg = translations['system.message.changePasswordOKMsg'];

            this.modalSrv.confirm({
              nzTitle: warnTitle,
              nzContent: content,
              nzOnOk: () => {
                this.message.success(okMsg);
                this.authService.logout();
              }
            });
          });
        }
      });
   }

  showSearchModal(): void {
    const modalOptions: ModalOptions = {
      nzClosable: false,
      nzMaskClosable: true,
      nzStyle: { top: '48px' },
      nzFooter: null,
      nzBodyStyle: { padding: '0' }
    };
    this.searchRouteService.show(modalOptions);
  }

  logOut(): void {
    this.message.success(this.translate.instant('system.message.logout'));
    this.authService.logout();
    this.cdr.markForCheck();
  }

  switchLang(lang: string) {
    localStorage.setItem(LocalStorageConstants.LANG, lang);
    this.translate.use(lang);
    this.setCurrentLanguage(lang);
    this.message.info(this.translate.instant('system.caption.switchSuccessful'));
  }

  setCurrentLanguage(id: string): void {
    // Find the language in listLanguage array and update the icon URL
    const language = this.listLanguage.find(lang => lang.id === id);
    if (language) {
      this.currentImageLange = this.baseImage + language.urlImage;
    }
  }

  getLanguage() {
    this.languageService.getLanguages().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.listLanguage = res;
        this.setCurrentLanguage(this.currentLang);
      },
      error: (e) => {
        throw e
      }
    })
  }

  ngOnInit(): void {
    this.currentLang = localStorage.getItem(LocalStorageConstants.LANG) ?? LangConstants.EN;
    this.getLanguage();
  }
}
