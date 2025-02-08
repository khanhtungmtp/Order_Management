import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

/*
 * Module preloading service, reference materials：https://dev.to/this-is-angular/optimize-your-angular-apps-user-experience-with-preloading-strategies-3ie7
 * */
@Injectable({
  providedIn: 'root'
})
export class SelectivePreloadingStrategyService implements PreloadingStrategy {
  preloadedModules: string[] = []; // This array is used to record the modules that have been configured to preload. There may be a need for it.

  preload(route: Route, load: () => Observable<any>): Observable<any> {
    //
    if (route.data?.['preload'] && route.path != null) {
      this.preloadedModules.push(route.path);
      return load();
    } else {
      return of(null);
    }
  }
}
