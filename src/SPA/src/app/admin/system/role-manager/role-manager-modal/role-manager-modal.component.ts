import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserVM } from '@app/_core/models/user-manager/uservm';
import { RoleService } from '@app/_core/services/user-manager/role.service';
import { fnCheckForm } from '@app/_core/utilities/tools';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NZ_MODAL_DATA, NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { Observable, catchError, of } from 'rxjs';

@Component({
  selector: 'app-role-manager-modal',
  templateUrl: './role-manager-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FormsModule, NzAlertModule, NzDatePickerModule, NzFormModule, ReactiveFormsModule, NzGridModule, NzInputModule, NzRadioModule, NzSwitchModule, NzTreeSelectModule, NzSelectModule, NzModalModule]

})
export class RoleManagerModalComponent implements OnInit {
  addEditForm!: FormGroup;
  isEdit: boolean = false;
  errorMessage: string = '';
  readonly nzModalData: UserVM = inject(NZ_MODAL_DATA);
  private fb = inject(FormBuilder);
  private roleService = inject(RoleService);
  private cdr = inject(ChangeDetectorRef);
  constructor(private modalRef: NzModalRef) { }

  //This method is if there is asynchronous data that needs to be loaded, add it in this method
  protected getAsyncFnData(modalValue: NzSafeAny): Observable<NzSafeAny> {
    return of(modalValue);
  }

  //Return false to not close the dialog box
  protected getCurrentValue(): Observable<NzSafeAny> {
    if (!fnCheckForm(this.addEditForm)) {
      return of(false);
    }
    const param = this.addEditForm.getRawValue();
    const operation = this.isEdit
      ? this.roleService.edit(this.nzModalData.id, param)
      : this.roleService.add(this.addEditForm.value);

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

  initForm(): void {
    this.addEditForm = this.fb.group({
      id: [null, [Validators.required]],
      name: [null, [Validators.required]]
    });
  }

  ngOnInit() {
    this.initForm();
    this.isEdit = !!this.nzModalData;
    if (this.isEdit) {
      this.addEditForm.patchValue(this.nzModalData);
      this.addEditForm.controls['id'].disable();
    }
  }
}

