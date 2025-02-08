import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { IconSelComponent } from '@app/admin/shared/biz-components/icon-sel/icon-sel.component';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { fnCheckForm } from '@app/_core/utilities/tools';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { Observable, of, catchError } from 'rxjs';
import { OptionsInterface } from '@app/_core/models/core/types';
import { OrderDto } from '@app/_core/models/order-manager/orderdto';
import { OrderService } from '@app/_core/services/order-manager/order.service';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
@Component({
  selector: 'app-order-manager-modal',
  standalone: true,
  imports: [IconSelComponent, NzModalModule, NzAlertModule, ReactiveFormsModule, NzTreeSelectModule, NzFormModule, NzDatePickerModule,
     NzRadioModule, NzSwitchModule,  NzInputModule, NzButtonModule, NzSelectModule, NzInputNumberModule],
  templateUrl: './order-modal.component.html'
})
export class OrderModalComponent implements OnInit {
  nodes: any[] = [];
  commandOptions: OptionsInterface[] = [];
  errorMessage: string = '';
  selIconVisible = false;
  addEditForm!: FormGroup;
  isEdit: boolean = false;
  listParentId: OrderDto[] | undefined = [];

  constructor(private fb: FormBuilder,
    private orderService: OrderService,
    private cdr: ChangeDetectorRef,
     private modalRef: NzModalRef,
    @Inject(NZ_MODAL_DATA) readonly nzModalData: OrderDto) { }

  async ngOnInit(): Promise<void> {
    this.initForm();
    this.isEdit = !!this.nzModalData;
    if (this.isEdit) {
      this.addEditForm.patchValue(this.nzModalData);
      this.addEditForm.controls['orderId'].disable();
      this.addEditForm.controls['customerId'].disable();
      this.addEditForm.controls['orderDate'].disable();
      this.addEditForm.controls['totalAmount'].disable();
    }
  }

  initForm() {
    this.addEditForm = this.fb.group({
      orderId: [{ value: '', disabled: false }, Validators.required],
      customerId: [{ value: '', disabled: false }, Validators.required],
      orderDate: [{ value: new Date(), disabled: true }, Validators.required],
      totalAmount: [{ value: '', disabled: false }, Validators.required],
      status: [0],
    });
  }

  //Return false to not close the dialog box
  protected getCurrentValue(): Observable<NzSafeAny> {
    if (!fnCheckForm(this.addEditForm)) {
      return of(false);
    }
    const param = this.addEditForm.getRawValue();
    const operation = this.isEdit
      ? this.orderService.edit(this.nzModalData.orderId, param)
      : this.orderService.add(this.addEditForm.value);

    return operation.pipe(
      catchError((error) => this.handleError(error))

    );
  }

  private handleError(error: any): Observable<NzSafeAny> {
    if (error.error && error.error.message) {
      this.errorMessage = error.error.message;
    } else {
      this.errorMessage = error.message;
    }
    this.cdr.detectChanges();
    return of(null);
  }

  seledIcon(e: string): void {
    this.addEditForm.get('icon')?.setValue(e);
  }

}
