import { CdkDragDrop, moveItemInArray, CdkDropList, CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { NgTemplateOutlet, NgStyle } from '@angular/common';
import { AfterContentInit, booleanAttribute, ChangeDetectionStrategy, Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableSize } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

import { ScreenLessHiddenDirective } from '../../directives/screen-less-hidden.directive';
import { AntTableComponentToken, TableHeader } from '../ant-table/ant-table.component';
import { AntTreeTableComponentToken } from '../tree-table/tree-table.component';

interface TableSizeItem {
  sizeName: string;
  selected: boolean;
  value: NzTableSize;
}

@Component({
  selector: 'app-card-table-wrap',
  templateUrl: './card-table-wrap.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NzCardModule,
    NgTemplateOutlet,
    NzDividerModule,
    NzSpaceModule,
    NzIconModule,
    NzButtonModule,
    NzPopoverModule,
    NzToolTipModule,
    ScreenLessHiddenDirective,
    NzDropDownModule,
    NzMenuModule,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    NzCheckboxModule,
    NgStyle
  ]
})
export class CardTableWrapComponent implements AfterContentInit {
  @Input() tableTitle: string | TemplateRef<NzSafeAny> | undefined;
  @Input() btnTpl: TemplateRef<NzSafeAny> | undefined;
  @Input({ transform: booleanAttribute })
  isNormalTable = true; // If you only need the card-table-wrap style, set this to false
  @Output() readonly reload = new EventEmitter<NzSafeAny>();
  @ContentChild(AntTableComponentToken) antTableComponent!: AntTableComponentToken;
  @ContentChild(AntTreeTableComponentToken) antTreeTableComponent!: AntTreeTableComponentToken;
  tableConfigVisible = false;
  tableSizeOptions: TableSizeItem[] = [
    { sizeName: 'default', selected: true, value: 'default' },
    { sizeName: 'middle', selected: false, value: 'middle' },
    { sizeName: 'small', selected: false, value: 'small' }
  ];
  tableHeaders: TableHeader[] = [];
  currentTableComponent!: AntTableComponentToken | AntTreeTableComponentToken;
  allTableFieldChecked = false; // Select all columns in settings
  allTableFieldIndeterminate = false; // Set the half-selected state of the select-all column inside
  copyHeader: TableHeader[] = []; // Cache default configuration

  // Whether to display checkbox
  changeTableCheckBoxShow(e: boolean): void {
    this.currentTableComponent.tableConfig.showCheckbox = e;
    this.tableChangeDectction();
  }

  // Large, medium and small table density
  tableSizeMenuClick(item: TableSizeItem): void {
    this.tableSizeOptions.forEach(tableSizeItem => (tableSizeItem.selected = false));
    item.selected = true;
    this.currentTableComponent.tableSize = item.value;
  }

  // Is all tableCheckbox selected in the configuration?
  changeAllTableTableConfigShow(e: boolean): void {
    if (e) {
      this.allTableFieldChecked = e;
      this.allTableFieldIndeterminate = false;
    }
    this.tableHeaders.forEach(item => (item.show = e));
    this.tableChangeDectction();
  }

  // Set fixed left or right side
  changeTableConfigShow(): void {
    const tempArray = [...this.tableHeaders];
    const fixedLeftArray: TableHeader[] = [];
    const fixedRightArray: TableHeader[] = [];
    const noFixedArray: TableHeader[] = [];
    tempArray.forEach(item => {
      if (item.fixed) {
        if (item.fixedDir === 'left') {
          fixedLeftArray.push(item);
        } else {
          fixedRightArray.push(item);
        }
      } else {
        noFixedArray.push(item);
      }
    });
    this.currentTableComponent.tableConfig.headers = [...fixedLeftArray, ...noFixedArray, ...fixedRightArray];
    this.tableChangeDectction();
  }

  dropTableConfig(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.tableHeaders, event.previousIndex, event.currentIndex);
    this.changeTableConfigShow();
  }

  fixedTableHead(dir: 'right' | 'left', item: TableHeader): void {
    item.fixed = !(item.fixed && item.fixedDir === dir);
    item.fixedDir = dir;
    this.changeTableConfigShow();
  }

  reloadClick(): void {
    this.reload.emit();
  }

  // Check changes in a certain column
  changeSignalCheck(e: boolean, item: TableHeader): void {
    item.show = e;
    this.judgeAllChecked();
    this.tableChangeDectction();
  }

  // Enable sublist change detection
  tableChangeDectction(): void {
    this.currentTableComponent.tableChangeDectction();
  }

  // The judgment column displays the status of this checkbox
  judgeAllChecked(): void {
    this.allTableFieldChecked = this.tableHeaders.every(item => item.show === true);
    const allUnChecked = this.tableHeaders.every(item => !item.show);
    this.allTableFieldIndeterminate = !this.allTableFieldChecked && !allUnChecked;
  }

  // reset
  reset(): void {
    this.tableHeaders = [];
    this.copyHeader.forEach(item => {
      this.tableHeaders.push({ ...item });
    });
    this.currentTableComponent.tableConfig.headers = [...this.tableHeaders];
    this.tableChangeDectction();
  }

  ngAfterContentInit(): void {
    this.currentTableComponent = this.antTableComponent || this.antTreeTableComponent;

    if (this.isNormalTable) {
      this.tableHeaders = [...this.currentTableComponent.tableConfig.headers];
      this.tableHeaders.forEach(item => {
        if (item.show === undefined) {
          item.show = true;
        }
      });
      this.copyHeader.length = 0;
      this.tableHeaders.forEach(item => {
        this.copyHeader.push({ ...item });
      });
      this.judgeAllChecked();
    }
  }
}
