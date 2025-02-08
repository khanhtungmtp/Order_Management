import { ChangeDetectorRef, Component, DestroyRef, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OptionsInterface } from '@app/_core/models/core/types';
import { SystemLanguageVM } from '@app/_core/models/system/systemlanguagevm';
import { Pagination, PaginationParam } from '@app/_core/utilities/pagination-utility';
import { AntTableComponent, AntTableConfig } from '@app/admin/shared/components/ant-table/ant-table.component';
import { CardTableWrapComponent } from '@app/admin/shared/components/card-table-wrap/card-table-wrap.component';
import { PageHeaderComponent, PageHeaderType } from '@app/admin/shared/components/page-header/page-header.component';
import { WaterMarkComponent } from '@app/admin/shared/components/water-mark/water-mark.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';
import { LanguagerModalService } from './language-modal/role-manager-modal.service';
import { ModalBtnStatus } from '@app/_core/utilities/base-modal';
import { MapKeyType, MapPipe, MapSet } from '@app/admin/shared/pipes/map.pipe';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { SystemLanguageService } from '@app/_core/services/system/system-language.service';

@Component({
  selector: 'app-language',
  standalone: true,
  imports: [TranslateModule,
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
    WaterMarkComponent],
  templateUrl: './language.component.html'
})
export class LanguageComponent implements OnInit {
  @ViewChild('operationTpl', { static: true }) operationTpl!: TemplateRef<any>;
  @ViewChild('isActiveFlag', { static: true }) isActiveFlag!: TemplateRef<NzSafeAny>;
  filter: string = '';
  isSearch: boolean = false;
  pagination: Pagination = <Pagination>{
    pageNumber: 1,
    pageSize: 10
  }
  tableConfig!: AntTableConfig;
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Language Manager',
    breadcrumb: ['Home', 'Language Manager', ' Manager']
  };
  dataList: SystemLanguageVM[] = [];
  checkedCashArray: SystemLanguageVM[] = [];
  isActiveOptions: OptionsInterface[] = [];

  private dataService = inject(SystemLanguageService);
  private modalSrv = inject(NzModalService);
  private cdr = inject(ChangeDetectorRef);
  private modalService = inject(LanguagerModalService);
  private message = inject(NzMessageService);
  private translate = inject(TranslateService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.isActiveOptions = [...MapPipe.transformMapToArray(MapSet.isActive, MapKeyType.Boolean)];
    this.initTable();
  }

  private initTable(): void {
    this.tableConfig = {
      headers: [
        {
          title: 'Id',
          field: 'id',
        },
        {
          title: 'Name',
          field: 'name'
        },
        {
          title: 'Url Image',
          field: 'urlImage'
        },
        {
          title: 'Seq',
          field: 'sortOrder'
        },
        {
          title: 'Active',
          field: 'isActive'
        },
        {
          title: 'Operation',
          tdTemplate: this.operationTpl,
          width: 150,
          fixed: true
        }
      ],
      total: 0,
      showCheckbox: true,
      loading: true,
      pageSize: 10,
      pageIndex: 1
    };
  }

  search(): void {
    this.isSearch = true;
    this.getDataList();
  }

  resetForm(): void {
    this.message.success('Reset successfully');
    this.tableConfig.pageSize = 10;
    this.getDataList();
  }

  getDataList(e?: NzTableQueryParams): void {
    this.tableConfig.loading = true;

    const _pagingParam: PaginationParam = {
      pageSize: e?.pageSize || this.pagination.pageSize,
      pageNumber: this.isSearch ? 1 : e?.pageIndex || this.pagination.pageNumber
    }

    this.dataService
      .getLanguagesPaging(this.filter, _pagingParam)
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

  tableLoading(isLoading: boolean): void {
    this.tableConfig.loading = isLoading;
    this.isSearch = isLoading;
    this.tableChangeDectction();
  }

  // Trigger table change detection
  tableChangeDectction(): void {
    // Changing the reference triggers change detection.
    this.dataList = [...this.dataList];
    this.cdr.detectChanges();
  }

  reloadTable(): void {
    this.message.info('Refresh successful');
    this.getDataList();
  }

  //Modify several items on a page
  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  selectedChecked(e: SystemLanguageVM[]): void {
    this.checkedCashArray = [...e];
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

  addModal(): void {
    this.modalService
      .show({ nzTitle: 'New language' })
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

  // // edit
  editModal(id: string): void {
    this.dataService
      .getById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.modalService
          .show({ nzTitle: 'Edit language' }, res)
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

}
