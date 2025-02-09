import { ChangeDetectorRef, Component, DestroyRef, Inject, OnInit } from '@angular/core';
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
import { Observable, of, catchError, combineLatest } from 'rxjs';
import { OptionsInterface } from '@app/_core/models/core/types';
import { OrderDto } from '@app/_core/models/order-manager/orderdto';
import { OrderService } from '@app/_core/services/order-manager/order.service';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { KeyValuePair } from '@app/_core/utilities/key-value-pair';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgIf } from '@angular/common';
import { ValidatorsService } from '@app/_core/services/validators/validators.service';
import { ProductRequest } from '@app/_core/models/order-manager/productdto';
import { OrderManagerCreateRequest } from '@app/_core/models/order-manager/ordermanagercreaterequest';
@Component({
  selector: 'app-order-manager-modal',
  standalone: true,
  imports: [NgIf, NzModalModule, NzAlertModule, ReactiveFormsModule, NzTreeSelectModule, NzFormModule, NzDatePickerModule,
    NzRadioModule, NzSwitchModule, NzInputModule, NzButtonModule, NzSelectModule, NzInputNumberModule],
  templateUrl: './order-modal.component.html'
})
export class OrderModalComponent implements OnInit {
  total: string = ''
  errorMessage: string = '';
  selIconVisible = false;
  addEditForm!: FormGroup;
  isEdit: boolean = false;
  isAdd: boolean = false;
  listParentId: OrderDto[] | undefined = [];
  listProducts: any[] = [];

  constructor(private fb: FormBuilder,
    private orderService: OrderService,
    private cdr: ChangeDetectorRef,
    private modalRef: NzModalRef,
    private destroyRef: DestroyRef,
    private validatorsService: ValidatorsService,
    @Inject(NZ_MODAL_DATA) readonly nzModalData: OrderDto) { }

  async ngOnInit(): Promise<void> {
    this.isEdit = !!this.nzModalData;
    this.isAdd = !this.nzModalData?.orderId
    this.initForm();
    // Kết hợp cả hai giá trị `products` và `quantity`
    combineLatest([
      this.addEditForm.get('products')!.valueChanges,
      this.addEditForm.get('quantity')!.valueChanges
    ]).subscribe(([selectedProducts, quantity]) => {
      if (selectedProducts?.length > 0 && quantity > 0) {
        const _request: ProductRequest = { productId: selectedProducts, quantity: quantity };
        // this.addEditForm.patchValue({ products: selectedProducts });
        this.getTotalProducts(_request);
        console.log('Calling API with:', selectedProducts, quantity);
      }
    });

    await Promise.all([this.getListProducts()]);
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
      orderId: [{ value: '', disabled: false }, this.isAdd ? [] : Validators.required],
      customerId: [{ value: '', disabled: false }, this.isAdd ? [] : Validators.required],
      orderDate: [{ value: new Date(), disabled: true }, this.isAdd ? [] : Validators.required],
      totalAmount: [{ value: '', disabled: false }, this.isAdd ? [] : Validators.required],
      status: [0],
      total: [{ value: 0, disabled: true }, this.isAdd ? [] : Validators.required],
      products: [null, []],
      quantity: [null, []],
      customerName: [null, []],
      email: [null, [, Validators.email]],
      phoneNumber: [null, [this.validatorsService.mobileValidator()]],
      address: [null, []]
    });
  }

  getTotalProducts(request: ProductRequest): void {
    this.orderService.getTotalProducts(request).subscribe({
      next: (res) => {
        // total of addEditForm
        this.addEditForm.patchValue({ total: res });


      },
      error: () => {
      }
    })
  }

  getListProducts(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.orderService.getListProducts().pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe({
        next: (res) => {
          this.listProducts = [];
          res.forEach(({ key, value }) => {
            const obj: OptionsInterface = {
              label: value,
              value: key!
            };
            this.listProducts.push(obj);
          });
          resolve();
        },
        error: (err) => reject(err)
      });
    });
  }

  //Return false to not close the dialog box
  protected getCurrentValue(): Observable<NzSafeAny> {
    if (!fnCheckForm(this.addEditForm)) {
      return of(false);
    }
    const param = this.addEditForm.getRawValue();
    const paramAdd: OrderManagerCreateRequest = {
      customerId: 'be685172-8fa6-4015-06bb-08dd4843b7b6',
      productId: param.products,
      quantity: param.quantity,
      subTotal: 0,
      totalAmount: 0
    } 
    const operation = this.isEdit
      ? this.orderService.edit(param)
      : this.orderService.add(paramAdd);

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
