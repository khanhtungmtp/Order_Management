import { Directive, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class HasRoleDirective {
  codeArray: string[];

  private authService = inject(AuthService);
  private templateRef = inject(TemplateRef);
  private viewContainerRef = inject(ViewContainerRef);

  constructor() {
    this.codeArray = this.authService.getUserProfile().permissions
  }

  @Input('appHasRole')
  set appHasRole(actionCode: string | undefined) {
    if (!actionCode) {
      this.show(true);
      return;
    }
    this.codeArray.includes(actionCode) ? this.show(true) : this.show(false);
  }

  private show(hasAuth: boolean): void {
    hasAuth ? this.viewContainerRef.createEmbeddedView(this.templateRef) : this.viewContainerRef.clear();
  }
}

