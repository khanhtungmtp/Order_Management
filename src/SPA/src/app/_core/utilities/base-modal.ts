import { DragDrop, DragRef } from '@angular/cdk/drag-drop';
import { ComponentRef, DestroyRef, inject, Injectable, Injector, Renderer2, RendererFactory2, TemplateRef, Type } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, of } from 'rxjs';
import { first, tap } from 'rxjs/operators';
import _ from 'lodash';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { ModalOptions, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { GLOBAL_TPL_MODAL_ACTION_TOKEN } from '@app/admin/tpl/global-modal-btn-tpl/global-modal-btn-tpl-token';
import { GlobalModalBtnTplComponentToken } from '@app/admin/tpl/global-modal-btn-tpl/global-modal-btn-tpl.component';
import { ModalFullStatusStoreService } from '../services/common/modal-full-status-store.service';
import { fnGetUUID } from './tools';
import { throwModalGetCurrentFnError, throwModalRefError } from './errors';

interface ModalZIndex {
  zIndex: number;
  canChange: boolean;
}

export const enum ModalBtnStatus {
  Cancel,
  Ok
}

export interface ModalResponse {
  status: ModalBtnStatus;
  modalValue: NzSafeAny;
}

// Component instances need to inherit this class
export abstract class BasicConfirmModalComponent {
  modalRef: NzModalRef<NzSafeAny, ModalResponse | boolean> = inject(NzModalRef);
  abstract getCurrentValue(): NzSafeAny;
}

@Injectable({
  providedIn: 'root'
})
export class ModalWrapService {
  protected bsModalService: NzModalService;
  private btnTpl!: TemplateRef<NzSafeAny>;
  private renderer: Renderer2;
  destroyRef = inject(DestroyRef);

  private baseInjector = inject(Injector);
  private modalFullStatusStoreService = inject(ModalFullStatusStoreService);
  dragDrop = inject(DragDrop);
  rendererFactory = inject(RendererFactory2);
  private btnComponentRef: ComponentRef<GlobalModalBtnTplComponentToken> = inject(GLOBAL_TPL_MODAL_ACTION_TOKEN);

  constructor() {
    this.bsModalService = this.baseInjector.get(NzModalService);
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.btnTpl = this.btnComponentRef.instance.componentTpl;
    this.modalFullStatusStoreService
      .getModalFullStatusStore()
      .pipe(takeUntilDestroyed())
      .subscribe(fullStatus => {
        this.fullScreenIconClick(fullStatus);
      });
  }

  fullScreenIconClick(fullStatus: boolean): void {
    this.bsModalService.openModals.forEach(modal => {
      if (fullStatus) {
        this.renderer.addClass(modal.containerInstance['host'].nativeElement, 'fullscreen-modal');
      } else {
        this.renderer.removeClass(modal.containerInstance['host'].nativeElement, 'fullscreen-modal');
      }
    });
  }

  protected getRandomCls(): string {
    return `NZ-MODAL-WRAP-CLS-${fnGetUUID()}`;
  }

  private cancelCallback<T extends BasicConfirmModalComponent>(modalContentCompInstance: T): void {
    this.modalCompVerification(modalContentCompInstance);
    this.modalFullStatusStoreService.setModalFullStatusStore(false);
    return modalContentCompInstance.modalRef.destroy({ status: ModalBtnStatus.Cancel, modalValue: null });
  }

  private confirmCallback<T extends BasicConfirmModalComponent>(modalContentCompInstance: T): void {
    this.modalCompVerification(modalContentCompInstance);
    modalContentCompInstance.modalRef.componentInstance
      .getCurrentValue()
      .pipe(
        tap(modalValue => {
          this.modalFullStatusStoreService.setModalFullStatusStore(false);
          if (!modalValue) {
            return of(false);
          } else {
            return modalContentCompInstance.modalRef.destroy({ status: ModalBtnStatus.Ok, modalValue });
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  modalCompVerification(modalContentCompInstance: BasicConfirmModalComponent): void {
    if (!modalContentCompInstance.modalRef) {
      throwModalRefError();
    }
    if (!modalContentCompInstance.modalRef.componentInstance.getCurrentValue) {
      throwModalGetCurrentFnError();
    }
  }


  getZIndex(element: HTMLElement): number {
    return +getComputedStyle(element, null).zIndex;
  }

  /**
   * Get the maximum value of all dialog boxes and determine whether they need to be modified
   *
   * @param wrapElement 待修改z-index 容器
   */
  getModalMaxZIndex(wrapElement: HTMLElement): ModalZIndex {
    return this.bsModalService.openModals.reduce<ModalZIndex>(
      (prev, modal) => {
        const element = modal.containerInstance['host'].nativeElement;
        if (wrapElement === element) {
          return prev;
        }
        const zIndex = this.getZIndex(element);
        if (zIndex >= prev.zIndex) {
          prev.zIndex = zIndex;
          prev.canChange = true;
        }
        return prev;
      },
      { zIndex: this.getZIndex(wrapElement), canChange: false! }
    );
  }

  // When the dialog panel is on, set the z-index of the current dialog to the maximum
  protected setMaxZIndex(wrapElement: HTMLElement): void {
    wrapElement.addEventListener(
      'mousedown',
      () => {
        const modalZIndex = this.getModalMaxZIndex(wrapElement);
        if (modalZIndex.canChange) {
          wrapElement.style.zIndex = `${modalZIndex.zIndex + 1}`;
        }
      },
      false
    );
  }

  protected createDrag<T = NzSafeAny>(wrapCls: string): DragRef<T> | null {
    const wrapElement = document.querySelector<HTMLDivElement>(`.${wrapCls}`)!;

    const rootElement = wrapElement.querySelector<HTMLDivElement>(`.ant-modal-content`)!;
    const handle = rootElement.querySelector<HTMLDivElement>('.ant-modal-header')!;
    const modalZIndex = this.getModalMaxZIndex(wrapElement);
    if (modalZIndex.canChange) {
      wrapElement.style.zIndex = `${modalZIndex.zIndex + 1}`;
    }
    // this.fixedWrapElementStyle(wrapElement);
    this.setMaxZIndex(wrapElement);
    if (handle) {
      handle.className += ' hand-model-move';
      return this.dragDrop.createDrag(handle).withHandles([handle]).withRootElement(rootElement);
    }
    return this.dragDrop.createDrag(rootElement).withHandles([rootElement]);
  }

  protected fixedWrapElementStyle(wrapElement: HTMLElement): void {
    wrapElement.style.pointerEvents = 'none';
  }

  // Create dialog box configuration items
  createModalConfig<T extends BasicConfirmModalComponent, U>(component: Type<T>, modalOptions: ModalOptions = {}, params?: U, wrapCls: string = ''): ModalOptions {
    const defaultOptions: ModalOptions<NzSafeAny, U> = {
      nzTitle: '',
      nzContent: component,
      nzCloseIcon: modalOptions.nzCloseIcon || this.btnTpl,
      nzMaskClosable: false,
      nzFooter: [
        {
          label: 'Confirm',
          type: 'primary',
          show: true,
          onClick: this.confirmCallback.bind(this)<T>
        },
        {
          label: 'Cancel',
          type: 'default',
          show: true,
          onClick: this.cancelCallback.bind(this)<T>
        }
      ],
      nzOnCancel: () => {
        return new Promise<ModalResponse>(resolve => {
          resolve({ status: ModalBtnStatus.Cancel, modalValue: null });
        });
      },
      nzClosable: true,
      nzWidth: 720,
      nzData: params // The attributes in the parameters will be passed into the nzContent instance
    };
    const newOptions = _.merge(defaultOptions, modalOptions);
    newOptions.nzWrapClassName = `${newOptions.nzWrapClassName || ''} ${wrapCls}`;
    return newOptions;
  }

  show<T extends BasicConfirmModalComponent, U>(component: Type<T>, modalOptions: ModalOptions = {}, params?: U): Observable<NzSafeAny> {
    const wrapCls = this.getRandomCls();
    const newOptions = this.createModalConfig<T, U>(component, modalOptions, params, wrapCls);
    const modalRef = this.bsModalService.create(newOptions);
    let drag: DragRef | null;
    modalRef.afterOpen.pipe(first(), takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      drag = this.createDrag(wrapCls);
    });

    return modalRef.afterClose.pipe(
      tap(() => {
        drag!.dispose();
        drag = null;
        this.modalFullStatusStoreService.setModalFullStatusStore(false);
      })
    );
  }
}
