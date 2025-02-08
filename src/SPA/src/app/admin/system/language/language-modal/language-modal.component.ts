import { ChangeDetectorRef, Component, DestroyRef, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SystemLanguageVM } from '@app/_core/models/system/systemlanguagevm';
import { FunctionService } from '@app/_core/services/system/function.service';
import { SystemLanguageService } from '@app/_core/services/system/system-language.service';
import { FunctionUtility } from '@app/_core/utilities/function-utility';
import { fnCheckForm } from '@app/_core/utilities/tools';
import { IconSelComponent } from '@app/admin/shared/biz-components/icon-sel/icon-sel.component';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NZ_MODAL_DATA, NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { Observable, of, catchError } from 'rxjs';

@Component({
  selector: 'app-language-modal',
  standalone: true,
  imports: [IconSelComponent, NzModalModule, NzAlertModule, ReactiveFormsModule, NzTreeSelectModule, NzSwitchModule,
    NzFormModule, NzInputModule, NzButtonModule, NzSelectModule, NzInputNumberModule],
  templateUrl: './language-modal.component.html'
})
export class LanguageModalComponent implements OnInit {
  addEditForm!: FormGroup;
  isEdit: boolean = false;
  errorMessage: string = '';

  constructor(private fb: FormBuilder,
    private languageService: SystemLanguageService,
    private ultility: FunctionUtility,
    private destroyRef: DestroyRef,
    private modalRef: NzModalRef,
    private cdr: ChangeDetectorRef,
    @Inject(NZ_MODAL_DATA) readonly nzModalData: SystemLanguageVM) { }

  ngOnInit() {
    this.initForm();
    this.isEdit = !!this.nzModalData;
    if (this.isEdit) {
      this.addEditForm.patchValue(this.nzModalData);
      this.addEditForm.controls['id'].disable();
    }
  }

  initForm() {
    this.addEditForm = this.fb.group({
      id: [{ value: '', disabled: false }, Validators.required],
      name: [{ value: '', disabled: false }, Validators.required],
      urlImage: ['', Validators.required],
      sortOrder: [0],
      isActive: [true],
    });
  }

  //Return false to not close the dialog box
  protected getCurrentValue(): Observable<NzSafeAny> {
    if (!fnCheckForm(this.addEditForm)) {
      return of(false);
    }
    const operation = this.isEdit
      ? this.languageService.edit(this.nzModalData.id, this.addEditForm.value)
      : this.languageService.add(this.addEditForm.value);

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
}
