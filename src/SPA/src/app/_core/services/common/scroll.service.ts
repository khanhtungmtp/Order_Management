import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScrollService {
  private readonly _doc = inject(DOCUMENT);
  private readonly platform = inject(Platform);
  private _getDoc(): Document {
    return this._doc || document;
  }

  private _getWin(): Window {
    const doc = this._getDoc();
    return doc.defaultView || window;
  }

  /**
   * Get scroll bar position
   *
   * @param element Specify element, default `window`
   */
  getScrollPosition(element?: Element | Window): [number, number] {
    if (!this.platform.isBrowser) {
      return [0, 0];
    }

    const win = this._getWin();
    if (element && element !== win) {
      return [(element as Element).scrollLeft, (element as Element).scrollTop];
    } else {
      return [win.pageXOffset, win.pageYOffset];
    }
  }

  /**
  * Set the scroll bar position
    *
    * @param element specified element
   */
  scrollToPosition(element: Element | Window | null | undefined, position: [number, number]): void {
    if (!this.platform.isBrowser) {
      return;
    }
    (element || this._getWin()).scrollTo(position[0], position[1]);
  }

  /**
  * Set the scroll bar to the specified element
    *
    * @param element specifies the element, default `document.body`
    * @param topOffset offset value, default `0`
   */
  scrollToElement(element?: Element | null, topOffset: number = 0): void {
    if (!this.platform.isBrowser) {
      return;
    }
    if (!element) {
      element = this._getDoc().body;
    }

    element.scrollIntoView();

    const win = this._getWin();
    if (win && win.scrollBy) {
      win.scrollBy(0, element!.getBoundingClientRect().top - topOffset);

      if (win.pageYOffset < 20) {
        win.scrollBy(0, -win.pageYOffset);
      }
    }
  }

  /**
 *Scroll to top
    *
    * @param topOffset offset value, default `0`
   */
  scrollToTop(topOffset: number = 0): void {
    if (!this.platform.isBrowser) {
      return;
    }
    this.scrollToElement(this._getDoc().body, topOffset);
  }
}
