import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OptionsInterface } from '@app/_core/models/core/types';
import { OrderDto } from '@app/_core/models/order-manager/orderdto';
import { OrderService } from '@app/_core/services/order-manager/order.service';
import { fnCheckForm } from '@app/_core/utilities/tools';
import { IconSelComponent } from '@app/admin/shared/biz-components/icon-sel/icon-sel.component';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzModalModule, NzModalRef, NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { Observable, of, catchError } from 'rxjs';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTableModule } from 'ng-zorro-antd/table';
import { OrderDetailDto } from '@app/_core/models/order-manager/orderdetaildto';
import { NgIf } from '@angular/common';
interface Person {
  key: string;
  name: string;
  age: number;
  address: string;
}
@Component({
  selector: 'app-form',
    standalone: true,
  imports: [NgIf, NzDividerModule, NzTableModule, NzModalModule, NzAlertModule, ReactiveFormsModule, NzTreeSelectModule, NzFormModule, NzDatePickerModule,
    NzRadioModule, NzSwitchModule, NzInputModule, NzButtonModule, NzSelectModule, NzInputNumberModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.less'
})
export class FormComponent implements OnInit {

  listOfData: Person[] = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park'
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park'
    },
  ]

  constructor(private fb: FormBuilder,
    private orderService: OrderService,
    private modalRef: NzModalRef,
    @Inject(NZ_MODAL_DATA) readonly nzModalData: OrderDetailDto[]) { }

  async ngOnInit(): Promise<void> {
    console.log(this.nzModalData);
  }


}
