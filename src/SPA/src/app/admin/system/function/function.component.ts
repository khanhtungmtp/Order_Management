import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef, ChangeDetectorRef, inject, DestroyRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FunctionService } from '@app/_core/services/system/function.service';
import { Pagination, PaginationParam } from '@app/_core/utilities/pagination-utility';
import { AntTableComponent, AntTableConfig, SortFile } from '@app/admin/shared/components/ant-table/ant-table.component';
import { CardTableWrapComponent } from '@app/admin/shared/components/card-table-wrap/card-table-wrap.component';
import { PageHeaderComponent, PageHeaderType } from '@app/admin/shared/components/page-header/page-header.component';
import { WaterMarkComponent } from '@app/admin/shared/components/water-mark/water-mark.component';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
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
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';
import { NzSpinnerCustomService } from '@app/_core/services/common/nz-spinner.service';
import { HasRoleDirective } from '@app/_core/directives/hasrole.directive';
import { ActionCode } from '@app/_core/constants/actionCode';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FunctionModalService } from './function-modal/function-modal.service';
import { ModalBtnStatus } from '@app/_core/utilities/base-modal';
import { FunctionVM } from '@app/_core/models/system/functionvm';

@Component({
  selector: 'app-function',
  templateUrl: './function.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    TranslateModule,
    PageHeaderComponent,
    NzCardModule,
    WaterMarkComponent,
    FormsModule,
    NzFormModule,
    NzGridModule,
    NzInputModule,
    NzButtonModule,
    NzWaveModule,
    NzIconModule,
    CardTableWrapComponent,
    AntTableComponent,
    NzBadgeModule,
    HasRoleDirective
  ]
})
export class FunctionComponent implements OnInit {
  @ViewChild('operationTpl', { static: true }) operationTpl!: TemplateRef<NzSafeAny>;
  actionCode = ActionCode;
  filter: string = '';
  isSearch: boolean = false;
  pagination: Pagination = <Pagination>{
    pageNumber: 1,
    pageSize: 10
  }
  tableConfig!: AntTableConfig;
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Function',
    breadcrumb: ['Homepage', 'Function Manager', 'Manager']
  };
  checkedCashArray: NzSafeAny[] = [];
  dataList: FunctionVM[] = [];

  private modalSrv = inject(NzModalService);
  private message = inject(NzMessageService);
  private cdr = inject(ChangeDetectorRef);
  private dataService = inject(FunctionService);
  protected spinnerService = inject(NzSpinnerCustomService);
  private translate = inject(TranslateService);
  private modalService = inject(FunctionModalService);
  destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.initTable();
  }

  search(): void {
    this.isSearch = true;
    this.getDataList();
  }

  // Triggered when the leftmost checkbox is selected
  selectedChecked(e: any): void {
    this.checkedCashArray = [...e];
  }

  // refresh page
  reloadTable(): void {
    this.message.info('Already refreshed');
    this.getDataList();
  }

  // Trigger table change detection
  tableChangeDectction(): void {
    // Changing the reference triggers change detection.
    this.dataList = [...(this.dataList || [])];
    this.cdr.detectChanges();
  }

  tableLoading(isLoading: boolean): void {
    this.tableConfig.loading = isLoading;
    this.isSearch = isLoading;
    this.tableChangeDectction();
  }

  getDataList(e?: NzTableQueryParams): void {
    /*-----The actual business request http interface is as follows------*/
    this.tableConfig.loading = true;
    const _pagingParam: PaginationParam = {
      pageSize: e?.pageSize || this.pagination.pageSize,
      pageNumber: this.isSearch ? 1 : (e?.pageIndex || this.pagination.pageNumber),
    }
    this.dataService.getFunctionsPaging(this.filter, _pagingParam).pipe(
      finalize(() => {
        this.tableLoading(false);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((response => {
      if (this.isSearch)
        this.message.success('Searched successfully');
      this.dataList = response.result;
      this.pagination = response.pagination;
      this.tableConfig.total = this.pagination.totalCount;
      this.tableConfig.pageIndex = this.pagination.pageNumber;
      this.checkedCashArray = [...this.checkedCashArray];
    }));

  }

  /*Reset*/
  resetForm(): void {
    this.message.success('Reset success');
    this.filter = '';
    this.tableConfig.pageSize = 10;
    this.getDataList();
  }

  addModal(): void {
    this.modalService
      .show({ nzTitle: 'New function' })
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

  deleteRow(id: string): void {
    this.modalSrv.confirm({
      nzTitle: this.translate.instant('system.message.confirmDeleteMsg'),
      nzContent: this.translate.instant('system.message.confirmDeleteMsgContent'),
      nzOnOk: () => {
        this.tableLoading(true);
        /*The comment is the simulation interface call*/
        this.dataService.delete(id).subscribe({
          next: () => {
            if (this.dataList.length === 1) {
              this.tableConfig.pageIndex--;
            }
            this.getDataList();
            this.checkedCashArray.splice(this.checkedCashArray.findIndex(item => item.id === id), 1);
          },
          error: (e) => {
            this.tableLoading(false);
            throw e
          }
        })

      }
    });
  }

  deleteRange(): void {
    if (this.checkedCashArray.length > 0) {
      this.modalSrv.confirm({
        nzTitle: this.translate.instant('system.message.confirmDeleteMsg'),
        nzContent: this.translate.instant('system.message.confirmDeleteMsgContent'),
        nzOnOk: () => {
          const ids: string[] = [];
          this.checkedCashArray.forEach(item => {
            ids.push(item.id);
          });
          this.tableLoading(true);
          this.dataService.deleteRange(ids).subscribe({
            next: () => {
              if (this.dataList.length === 1) {
                this.tableConfig.pageIndex--;
              }
              this.getDataList();
              this.checkedCashArray = [];
            },
            error: (e) => {
              this.tableLoading(false);
              throw e
            }
          })
        }
      });
    } else {
      this.message.error('Please check the data');
      return;
    }
  }

  changeSort(e: SortFile): void {
    this.message.info(`Sort field: ${e.fileName}, sorting: ${e.sortDir}`);
  }

  //Modify several items on a page
  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  private initTable(): void {
    /*
     * Note that you need to leave one column here without setting the width, so that the list can adapt to the width.
     *
     * */
    this.tableConfig = {
      headers: [
        {
          title: 'Id',
          field: 'id',
          showSort: true
        },
        {
          title: 'Name',
          field: 'name',
          showSort: true
        },
        {
          title: 'Url',
          field: 'url',
          tdClassList: ['operate-text']
        },
        {
          title: 'Seq.',
          field: 'sortOrder'
        },
        {
          title: 'Icon',
          field: 'icon'
        },
        {
          title: 'Operation',
          tdTemplate: this.operationTpl,
          fixed: true,
          fixedDir: 'right'
        }
      ],
      total: 0,
      showCheckbox: true,
      loading: false,
      pageSize: 10,
      pageIndex: 1
    };
  }

}
