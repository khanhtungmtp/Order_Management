// https://netbasal.com/getting-to-know-the-createcomponent-api-in-angular-22fb115f08e2
// https://angular.io/api/core/createComponent
import { ApplicationRef, ComponentRef, createComponent, EnvironmentInjector, inject, InjectionToken, TemplateRef } from '@angular/core';
import { GlobalDrawerFootTplComponent } from './global-drawer-foot-tpl.component';
/**
 * The footer template of the global drawer, which is the OK and Cancel buttons.
 */
export const GLOBAL_DRAWER_FOOT_TPL_TOKEN = new InjectionToken<ComponentRef<GlobalDrawerFootTplComponent>>('drawer action btn token', {
  providedIn: 'root',
  factory: () => {
    const appRef = inject(ApplicationRef);
    const injector = inject(EnvironmentInjector);

    const componentRef = createComponent(GlobalDrawerFootTplComponent, {
      environmentInjector: injector
    });
    // Register the newly created ref with an `ApplicationRef` instance to include the component view into the change detection cycle.
    appRef.attachView(componentRef.hostView);
    return componentRef;
  }
});
