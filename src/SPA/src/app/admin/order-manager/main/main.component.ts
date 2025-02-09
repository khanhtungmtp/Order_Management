import { ChangeDetectorRef, Component, DestroyRef, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActionCode } from '@app/_core/constants/actionCode';
import { HasRoleDirective } from '@app/_core/directives/hasrole.directive';
import { OrderDto } from '@app/_core/models/order-manager/orderdto';
import { NzSpinnerCustomService } from '@app/_core/services/common/nz-spinner.service';
import { OrderService } from '@app/_core/services/order-manager/order.service';
import { ModalBtnStatus } from '@app/_core/utilities/base-modal';
import { Pagination, PaginationParam } from '@app/_core/utilities/pagination-utility';
import { AntTableComponent, AntTableConfig, SortFile } from '@app/admin/shared/components/ant-table/ant-table.component';
import { CardTableWrapComponent } from '@app/admin/shared/components/card-table-wrap/card-table-wrap.component';
import { PageHeaderComponent, PageHeaderType } from '@app/admin/shared/components/page-header/page-header.component';
import { WaterMarkComponent } from '@app/admin/shared/components/water-mark/water-mark.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
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
import { OrderManagerModalService } from '../order-manager-modal/order-modal.service';
@Component({
  selector: 'app-main',
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
    ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.less'
})
export class MainComponent implements OnInit {
  @ViewChild('operationTpl', { static: true }) operationTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('statusFlag', { static: true }) statusFlag!: TemplateRef<NzSafeAny>;
  actionCode = ActionCode;
  filter: string = '';
  isSearch: boolean = false;
  pagination: Pagination = <Pagination>{
    pageNumber: 1,
    pageSize: 10
  }
  tableConfig!: AntTableConfig;
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Order',
    breadcrumb: ['Homepage', 'Order Manager', 'Manager']
  };
  checkedCashArray: NzSafeAny[] = [];
  dataList: OrderDto[] = [];

  private modalSrv = inject(NzModalService);
  private message = inject(NzMessageService);
  private cdr = inject(ChangeDetectorRef);
  private dataService = inject(OrderService);
  protected spinnerService = inject(NzSpinnerCustomService);
  private translate = inject(TranslateService);
  private modalService = inject(OrderManagerModalService);
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
    this.dataService.getOrderManagerPaging(_pagingParam).pipe(
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
      .show({ nzTitle: 'New order' })
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

  // viewRow
  viewRow(id: string): void {
    this.dataService
      .getOrderDetail(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.modalService
          .view({ nzTitle: 'view order' }, res)
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
 
  // edit
  editModal(id: string): void {
    this.dataService
      .getById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.modalService
          .show({ nzTitle: 'Edit order' }, res)
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
          title: 'Mã đơn hàng',
          field: 'orderId',
          showSort: true
        },
        {
          title: 'khách hàng',
          field: 'customerName',
          showSort: true
        },
        // {
        //   title: 'orderDate',
        //   field: 'orderDate',
        //   tdClassList: ['operate-text'],
        //   pipe: 'date:yyyy-MM-dd HH:mm'
        // },
        {
          title: 'Tổng tiền',
          field: 'totalAmount'
        },
        {
          title: 'Trạng thái',
          field: 'status',
          pipe: 'status'
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
