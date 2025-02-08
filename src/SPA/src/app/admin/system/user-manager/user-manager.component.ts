import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActionCode } from '@app/_core/constants/actionCode';
import { OptionsInterface } from '@app/_core/models/core/types';
import { ModalBtnStatus } from '@app/_core/utilities/base-modal';
import { AntTableComponent, AntTableConfig } from '@app/admin/shared/components/ant-table/ant-table.component';
import { CardTableWrapComponent } from '@app/admin/shared/components/card-table-wrap/card-table-wrap.component';
import { PageHeaderComponent, PageHeaderType } from '@app/admin/shared/components/page-header/page-header.component';
import { MapPipe, MapSet, MapKeyType } from '@app/admin/shared/pipes/map.pipe';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';
import { UserManagerModalService } from './user-manager-modal/user-manager-modal.service';
import { UserVM } from '@app/_core/models/user-manager/uservm';
import { UserManagerService } from '@app/_core/services/user-manager/user-manager.service';
import { Pagination, PaginationParam } from '@app/_core/utilities/pagination-utility';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { WaterMarkComponent } from '@app/admin/shared/components/water-mark/water-mark.component';
@Component({
  selector: 'app-user-manager',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    TranslateModule,
    NzRadioModule,
    PageHeaderComponent,
    NzGridModule,
    NzCardModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
    NzWaveModule,
    NzIconModule,
    CardTableWrapComponent,
    AntTableComponent,
    NzSwitchModule,
    WaterMarkComponent
  ],
  templateUrl: './user-manager.component.html'
})
export class UserManagerComponent implements OnInit {
  @ViewChild('operationTpl', { static: true }) operationTpl!: TemplateRef<any>;
  @ViewChild('isActiveFlag', { static: true }) isActiveFlag!: TemplateRef<NzSafeAny>;
  searchParams!: FormGroup;
  pagination: Pagination = <Pagination>{
    pageNumber: 1,
    pageSize: 10
  }
  tableConfig!: AntTableConfig;
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'User Manager',
    breadcrumb: ['Home', 'User Manager', ' Manager']
  };
  dataList: UserVM[] = [];
  checkedCashArray: UserVM[] = [];
  ActionCode = ActionCode;
  isCollapse: boolean = true;
  isSearch: boolean = false;
  isActiveOptions: OptionsInterface[] = [];
  destroyRef = inject(DestroyRef);

  private dataService = inject(UserManagerService);
  private modalSrv = inject(NzModalService);
  private cdr = inject(ChangeDetectorRef);
  private modalService = inject(UserManagerModalService);
  private message = inject(NzMessageService);
  private fb = inject(FormBuilder);
  private translate = inject(TranslateService);

  ngOnInit(): void {
    this.isActiveOptions = [...MapPipe.transformMapToArray(MapSet.isActive, MapKeyType.Boolean)];
    this.initSearchParam();
    this.initTable();
  }

  initSearchParam() {
    this.searchParams = this.fb.group({
      userName: [''],
      email: [''],
      phoneNumber: [''],
      fullName: [''],
      gender: [null],
      isActive: [null]
    });
  }

  searchForm(): void {
    this.isSearch = true;
    this.getDataList();
  }

  selectedChecked(e: UserVM[]): void {
    this.checkedCashArray = [...e];
  }

  resetForm(): void {
    this.message.success('Reset successfully');
    this.searchParams.reset();
    this.tableConfig.pageSize = 10;
    this.getDataList();
  }

  getDataList(e?: NzTableQueryParams): void {
    this.tableConfig.loading = true;

    const _pagingParam: PaginationParam = {
      pageSize: e?.pageSize || this.pagination.pageSize,
      pageNumber: this.isSearch ? 1 : (e?.pageIndex || this.pagination.pageNumber),
    }

    const searchParamsValue = this.searchParams.value;

    this.dataService
      .getUsersPaging(_pagingParam, searchParamsValue)
      .pipe(
        finalize(() => {
          this.tableLoading(false);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(response => {
        if (this.isSearch)
          this.message.success('Searched successfully');
        this.dataList = response.result;
        this.pagination = response.pagination;
        this.tableConfig.total = this.pagination.totalCount;
        this.tableConfig.pageIndex = this.pagination.pageNumber;
        this.checkedCashArray = [...this.checkedCashArray];
      });
  }

  // Trigger table change detection
  tableChangeDectction(): void {
    // Changing the reference triggers change detection.
    this.dataList = [...this.dataList];
    this.cdr.detectChanges();
  }

  tableLoading(isLoading: boolean): void {
    this.tableConfig.loading = isLoading;
    this.isSearch = isLoading;
    this.tableChangeDectction();
  }

  addModal(): void {
    this.modalService
      .show({ nzTitle: 'New user' })
      .pipe(
        finalize(() => {
          this.tableLoading(false);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(res => {
        if (!res || res.status === ModalBtnStatus.Cancel) {
          return;
        }
        this.tableLoading(true);
        this.getDataList();
      });
  }

  reloadTable(): void {
    this.message.info('Refresh successful');
    this.getDataList();
  }

  // edit
  editModal(id: string): void {
    this.dataService
      .getById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.modalService
          .show({ nzTitle: 'Edit user' }, res)
          .pipe(
            finalize(() => {
              this.tableLoading(false);
            }),
            takeUntilDestroyed(this.destroyRef)
          )
          .subscribe(({ status }) => {
            if (status === ModalBtnStatus.Cancel) {
              return;
            }
            this.tableLoading(true);
            this.getDataList();
          });
      });
  }

  changeStatus(id: string, isActive: boolean): void {
    this.tableConfig.loading = true;
    this.dataService
      .updateStatus(id, !isActive)
      .pipe(
        finalize(() => {
          this.tableLoading(false);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  deleteRange(): void {
    if (this.checkedCashArray.length > 0) {
      const ids: string[] = [];
      this.modalSrv.confirm({
        nzTitle: this.translate.instant('system.message.confirmDeleteMsg'),
        nzContent: this.translate.instant('system.message.confirmDeleteMsgContent'),
        nzOnOk: () => {
          this.checkedCashArray.forEach(item => {
            ids.push(item.id);
          });
          this.tableLoading(true);
          this.dataService
            .deleteRange(ids)
            .pipe(
              finalize(() => {
                this.tableLoading(false);
              }),
              takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(() => {
              if (this.dataList.length === 1) {
                this.tableConfig.pageIndex--;
              }
              this.getDataList();
              this.checkedCashArray = [];
            });
        }
      });
    } else {
      this.message.error('Please check the data');
      return;
    }
  }

  deleteRow(id: string): void {
    this.modalSrv.confirm({
      nzTitle: this.translate.instant('system.message.confirmDeleteMsg'),
      nzContent: this.translate.instant('system.message.confirmDeleteMsgContent'),
      nzOnOk: () => {
        this.tableLoading(true);
        this.dataService
          .delete(id)
          .pipe(
            finalize(() => {
              this.tableLoading(false);
            }),
            takeUntilDestroyed(this.destroyRef)
          )
          .subscribe(() => {
            if (this.dataList.length === 1) {
              this.tableConfig.pageIndex--;
            }
            this.getDataList();
          });
      }
    });
  }

  //Modify several items on a page
  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  /*Expand*/
  toggleCollapse(): void {
    this.isCollapse = !this.isCollapse;
  }

  private initTable(): void {
    this.tableConfig = {
      showCheckbox: true,
      headers: [
        {
          title: 'User name',
          field: 'userName',
          width: 100
        },
        {
          title: 'Full name',
          width: 100,
          field: 'fullName'
        },
        {
          title: 'Gender',
          width: 70,
          field: 'gender',
          pipe: 'gender'
        },
        {
          title: 'Phone Number',
          width: 100,
          field: 'phoneNumber'
        },
        {
          title: 'Email',
          width: 100,
          field: 'email'
        },
        {
          title: 'Is active',
          width: 100,
          field: 'isActive',
          tdTemplate: this.isActiveFlag
        },
        {
          title: 'Last Login Time',
          width: 120,
          field: 'lastLoginTime',
          pipe: 'date:yyyy-MM-dd HH:mm'
        },
        {
          title: 'Roles',
          width: 100,
          field: 'roles',
        },
        {
          title: 'Operation',
          tdTemplate: this.operationTpl,
          width: 150,
          fixed: true
        }
      ],
      total: 0,
      loading: true,
      pageSize: 10,
      pageIndex: 1
    };
  }
}

