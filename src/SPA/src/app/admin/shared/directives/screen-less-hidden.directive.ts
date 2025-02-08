import { BreakpointObserver } from '@angular/cdk/layout';
import { Directive, inject, Input, TemplateRef, ViewContainerRef } from '@angular/core';

/*Các thành phần không được hiển thị khi chiều rộng màn hình nhỏ hơn chiều rộng nhất định*/
@Directive({
  selector: '[appScreenLessHidden]',
  standalone: true
})
export class ScreenLessHiddenDirective {
  @Input('appScreenLessHidden')
  set appScreenLessHidden(lessScreen: string | undefined) {
    if (!lessScreen) {
      this.show(true);
      return;
    }
    this.breakpointObserver.observe([`(max-width: ${lessScreen}px)`]).subscribe(result => {
      if (result.matches) {
        this.show(false);
      } else {
        this.show(true);
      }
    });
  }

  private breakpointObserver = inject(BreakpointObserver);
  private templateRef = inject(TemplateRef);
  private viewContainerRef = inject(ViewContainerRef);

  private show(matched: boolean): void {
    matched ? this.viewContainerRef.createEmbeddedView(this.templateRef) : this.viewContainerRef.clear();
  }
}
