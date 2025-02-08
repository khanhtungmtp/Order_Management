import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';
import { NzHighlightModule } from 'ng-zorro-antd/core/highlight';
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { DepartmentTreeSearchService } from './department-tree-search.service';
import { DepartmentTreeService, FlatNode } from './department-tree.service';
@Component({
  selector: 'app-department-tree',
  templateUrl: './department-tree.component.html',
  styleUrl: './department-tree.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DepartmentTreeService, DepartmentTreeSearchService],
  standalone: true,
  imports: [NzCardModule, NzButtonModule, NzInputModule, FormsModule, NzIconModule, NzTreeViewModule, NzHighlightModule]
})
export class DepartmentTreeComponent implements OnInit {
  selectListSelection: SelectionModel<FlatNode>;
  treeControl: FlatTreeControl<FlatNode>;
  @Output() readonly deptIdEven = new EventEmitter<number>();

  deptTreeService = inject(DepartmentTreeService);
  deptTreeSearchService = inject(DepartmentTreeSearchService);

  constructor() {
    this.selectListSelection = this.deptTreeService.selectListSelection;
    this.treeControl = this.deptTreeService.treeControl;
  }

  changeSearch(event: string): void {
    this.deptTreeSearchService.searchValue$.next(event);
  }

  clickNode(node: FlatNode): void {
    this.deptTreeService.clickNode(node);
    this.deptIdEven.emit(node.id);
  }

  resetTree(): void {
    this.deptTreeService.resetTree();
  }

  ngOnInit(): void {
    this.deptTreeService.initDate();
  }
}

