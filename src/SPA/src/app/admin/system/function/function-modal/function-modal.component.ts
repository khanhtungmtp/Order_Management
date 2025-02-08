import { ChangeDetectorRef, Component, DestroyRef, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { FunctionService } from '@app/_core/services/system/function.service';
import { FunctionVM } from '@app/_core/models/system/functionvm';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { FunctionUtility } from '@app/_core/utilities/function-utility';
import { IconSelComponent } from '@app/admin/shared/biz-components/icon-sel/icon-sel.component';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { fnCheckForm } from '@app/_core/utilities/tools';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { Observable, of, catchError } from 'rxjs';
import { OptionsInterface } from '@app/_core/models/core/types';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-function-modal',
  standalone: true,
  imports: [IconSelComponent, NzModalModule, NzAlertModule, ReactiveFormsModule, NzTreeSelectModule, NzFormModule,
    NzInputModule, NzButtonModule, NzSelectModule, NzInputNumberModule],
  templateUrl: './function-modal.component.html'
})
export class FunctionModalComponent implements OnInit {
  nodes: any[] = [];
  commandOptions: OptionsInterface[] = [];
  errorMessage: string = '';
  selIconVisible = false;
  addEditForm!: FormGroup;
  isEdit: boolean = false;
  listParentId: FunctionVM[] | undefined = [];

  constructor(private fb: FormBuilder,
    private functionService: FunctionService,
    private ultility: FunctionUtility,
    private destroyRef: DestroyRef,
    private modalRef: NzModalRef,
    private cdr: ChangeDetectorRef,
    @Inject(NZ_MODAL_DATA) readonly nzModalData: FunctionVM) { }

  async ngOnInit(): Promise<void> {
    this.initForm();
    this.isEdit = !!this.nzModalData;
    await Promise.all([this.getParentIds(), this.getCommands()]);
    if (this.isEdit) {
      this.addEditForm.patchValue(this.nzModalData);
      this.addEditForm.controls['id'].disable();
    }
  }

  initForm() {
    this.addEditForm = this.fb.group({
      id: [{ value: '', disabled: false }, Validators.required],
      name: [{ value: '', disabled: false }, Validators.required],
      url: ['', Validators.required],
      sortOrder: [0],
      parentId: ['', Validators.required],
      icon: ['', Validators.required],
      commandInFunction: [null, [Validators.required]]
    });
  }

  //Return false to not close the dialog box
  protected getCurrentValue(): Observable<NzSafeAny> {
    if (!fnCheckForm(this.addEditForm)) {
      return of(false);
    }
    const param = this.addEditForm.getRawValue();
    const operation = this.isEdit
      ? this.functionService.edit(this.nzModalData.id, param)
      : this.functionService.add(this.addEditForm.value);

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

  getParentIds(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.functionService.getParentIds().pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe({
        next: (res) => {
          this.listParentId = this.ultility.unflatteringForLeftMenu(res);
          const rootParent: any = {
            "id": "ROOT",
            "name": "ROOT",
            "url": "",
            "sortOrder": 0,
            "parentId": "ROOT",
            "icon": "branches",
            "children": []
          }
          this.listParentId.unshift(rootParent);
          this.nodes = this.mapTreeNodes(this.listParentId);
          resolve();
        },
        error: (err) => reject(err)
      });
    });
  }

  getCommands(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.functionService.getCommands().pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe({
        next: (res) => {
          this.commandOptions = [];
          res.forEach(({ id, name }) => {
            const obj: OptionsInterface = {
              label: name,
              value: id!
            };
            this.commandOptions.push(obj);
          });
          resolve();
        },
        error: (err) => reject(err)
      });
    });
  }

  // map response to tree format ng zorror
  mapTreeNodes(nodes: any[]): any[] {
    return nodes.map(node => ({
      title: node.name,
      key: node.id,
      icon: node.icon,
      children: this.mapTreeNodes(node.children || []),
      isLeaf: node.children.length === 0
    }));
  }

}
