import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, Input, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { PageHeaderComponent, PageHeaderType } from '@app/admin/shared/components/page-header/page-header.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { FooterSubmitComponent } from '@app/admin/shared/components/footer-submit/footer-submit.component';
import { UrlRouteConstants } from '@app/_core/constants/url-route.constants';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { FormsModule } from '@angular/forms';
import { WaterMarkComponent } from '@app/admin/shared/components/water-mark/water-mark.component';
import { RoleService } from '@app/_core/services/user-manager/role.service';
import { FunctionUtility } from '@app/_core/utilities/function-utility';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { SystemConstants } from '@app/_core/constants/system.constants';
import { PermissionVm } from '@app/_core/models/system/permissionvm';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Router } from '@angular/router';

export interface TreeNodeInterface {
  id: string;
  name: string;
  parentId?: string;
  level?: number;
  expand?: boolean;
  icon?: string;
  sortOrder?: string;
  url?: string;
  hasCreate?: boolean;
  hasApprove?: boolean;
  hasDelete?: boolean;
  hasUpdate?: boolean;
  hasView?: boolean;
  children?: TreeNodeInterface[];
  parent?: TreeNodeInterface;
}

@Component({
  selector: 'app-role-manager-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [PageHeaderComponent, NzTreeModule, FooterSubmitComponent, NzIconModule, NzCardModule, NzTableModule, NzButtonModule,
    FormsModule, WaterMarkComponent, NzCollapseModule, NzCheckboxModule, NzCardModule, NzTreeViewModule],
  templateUrl: './role-manager-detail.component.html',
  styleUrl: './role-manager-detail.component.less'
})
export class RoleManagerDetailComponent implements OnInit {
  @Input() roleId: string = '';
  // expand all collapse all
  isAllExpanded: boolean = true;
  private roleService = inject(RoleService);
  private destroyRef = inject(DestroyRef);
  private functionUtility = inject(FunctionUtility);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  urlRole = UrlRouteConstants.ROLE;
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Role detail',
    breadcrumb: ['Home', 'Role Manager', ' Detail']
  }
  isShowTHApprove: boolean = true
  functions: any[] = []
  public permissionRoleIds: PermissionVm[] = [];
  public checkedViews: PermissionVm[] = [];
  public checkedCreates: PermissionVm[] = [];
  public checkedUpdates: PermissionVm[] = [];
  public checkedDeletes: PermissionVm[] = [];
  public checkedApproves: PermissionVm[] = [];
  // changes
  public changedCheckboxViews: PermissionVm[] = [];
  public changedCheckboxCreates: PermissionVm[] = [];
  public changedCheckboxUpdates: PermissionVm[] = [];
  public changedCheckboxDeletes: PermissionVm[] = [];
  public changedCheckboxApproves: PermissionVm[] = [];
  public flattenFunctions: any[] = [];
  mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};
  checkedAll = {
    view: false,
    create: false,
    update: false,
    delete: false,
    approve: false
  };

  ngOnInit(): void {
    this.loadDataTree()
    this.isShowTHApprove = this.checkedApproves.length > 0 && this.checkedApproves.some(x => x.checked)
  }

  toggleExpandAll() {
    this.isAllExpanded = !this.isAllExpanded; // Đảo ngược trạng thái

    if (this.functions && Array.isArray(this.functions)) {
      // Chỉ chạy loop nếu 'functions' tồn tại và là một mảng
      this.functions.forEach(rowData => {
        // Kiểm tra xem 'mapOfExpandedData' có phần tử tương ứng và đó có phải là mảng không
        if (this.mapOfExpandedData[rowData.id] && Array.isArray(this.mapOfExpandedData[rowData.id])) {
          this.mapOfExpandedData[rowData.id].forEach(item => {
            item.expand = this.isAllExpanded;
          });
        }
      });
    }
  }

  checkInitialCheckAll() {
    // this.checkedAll.view = this.checkedViews.every(c => c.checked);
    // this.checkedAll.create = this.checkedCreates.every(c => c.checked);
    // this.checkedAll.update = this.checkedUpdates.every(c => c.checked);
    // this.checkedAll.delete = this.checkedDeletes.every(c => c.checked);
    // this.checkedAll.approve = this.checkedApproves.every(c => c.checked);
    this.checkedAll.view = this.changedCheckboxViews.every(c => c.checked);
    this.checkedAll.create = this.changedCheckboxCreates.every(c => c.checked);
    this.checkedAll.update = this.changedCheckboxUpdates.every(c => c.checked);
    this.checkedAll.delete = this.changedCheckboxDeletes.every(c => c.checked);
    this.checkedAll.approve = this.changedCheckboxApproves.every(c => c.checked);
  }

  savePermission() {
    const request: PermissionVm[] = [...this.changedCheckboxViews, ...this.changedCheckboxCreates,
    ...this.changedCheckboxUpdates, ...this.changedCheckboxDeletes, ...this.changedCheckboxApproves];
    this.roleService.putPermissions(this.roleId, request)
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  checkAll(type: string, checked: boolean): void {
    // Update the state of individual checkboxes based on the type
    if (type === 'VIEW') {
      this.changedCheckboxViews.forEach(item => item.checked = checked);
    } else if (type === 'CREATE') {
      this.changedCheckboxCreates.forEach(item => item.checked = checked);
    } else if (type === 'UPDATE') {
      this.changedCheckboxUpdates.forEach(item => item.checked = checked);
    } else if (type === 'DELETE') {
      this.changedCheckboxDeletes.forEach(item => item.checked = checked);
    } else if (type === 'APPROVE') {
      this.changedCheckboxApproves.forEach(item => item.checked = checked);
    }
    this.cdr.detectChanges();

  }

  checkChanged(checked: boolean, commandId: string, functionId: string) {
    let checkedActionsChanges;
    // Map commandId to the corresponding array
    switch (commandId) {
      case SystemConstants.VIEW_ACTION:
        checkedActionsChanges = this.changedCheckboxViews;
        break;
      case SystemConstants.CREATE_ACTION:
        checkedActionsChanges = this.changedCheckboxCreates;
        break;
      case SystemConstants.UPDATE_ACTION:
        checkedActionsChanges = this.changedCheckboxUpdates;
        break;
      case SystemConstants.DELETE_ACTION:
        checkedActionsChanges = this.changedCheckboxDeletes;
        break;
      case SystemConstants.APPROVE_ACTION:
        checkedActionsChanges = this.changedCheckboxApproves;
        break;
      default:
        console.error('Unsupported commandId:', commandId);
        return;
    }

    // Find the permission index in the checked array
    const existingPermissionIndex = checkedActionsChanges.findIndex(x =>
      x.functionId === functionId &&
      x.commandId === commandId &&
      x.roleId === this.roleId
    );

    const permissionEntity: PermissionVm = {
      commandId: commandId,
      functionId: functionId,
      roleId: this.roleId,
      checked: checked
    };

    if (existingPermissionIndex !== -1) {
      // If permission exists in the array, update it
      checkedActionsChanges[existingPermissionIndex].checked = checked;
    } else {
      // Otherwise, add the new permission entity
      checkedActionsChanges.push(permissionEntity);
    }
    this.checkInitialCheckAll();
    this.cdr.detectChanges();
  }

  handleChecked(functionId: string, commandId: string): boolean {
    switch (commandId) {
      case SystemConstants.VIEW_ACTION:
        return this.changedCheckboxViews.some((v: PermissionVm) => v.functionId === functionId && v.commandId === commandId && v.checked);

      case SystemConstants.CREATE_ACTION:
        return this.changedCheckboxCreates.some((c: PermissionVm) => c.functionId === functionId && c.commandId === commandId && c.checked);

      case SystemConstants.UPDATE_ACTION:
        return this.changedCheckboxUpdates.some((u: PermissionVm) => u.functionId === functionId && u.commandId === commandId && u.checked);

      case SystemConstants.DELETE_ACTION:
        return this.changedCheckboxDeletes.some((d: PermissionVm) => d.functionId === functionId && d.commandId === commandId && d.checked);

      case SystemConstants.APPROVE_ACTION:
        return this.changedCheckboxApproves.some((a: PermissionVm) => a.functionId === functionId && a.commandId === commandId && a.checked);

      default:
        return false;
    }
  }

  collapse(array: TreeNodeInterface[], data: TreeNodeInterface, $event: boolean): void {
    if (!$event) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.id === d.id)!;
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  convertTreeToList(root: TreeNodeInterface, expandAll: boolean): TreeNodeInterface[] {
    const stack: TreeNodeInterface[] = [];
    const array: TreeNodeInterface[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: expandAll });

    while (stack.length !== 0) {
      const node = stack.pop()!;
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[i], level: node.level! + 1, expand: expandAll, parent: node });
        }
      }
    }

    return array;
  }

  visitNode(node: TreeNodeInterface, hashMap: { [key: string]: boolean }, array: TreeNodeInterface[]): void {
    if (!hashMap[node.id]) {
      hashMap[node.id] = true;
      array.push(node);
    }
  }

  loadDataTree() {
    this.roleService.getTreeDataRole().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res => {
      this.functions = res;
      const _functions = this.functionUtility.unflatteringForTree(res);
      _functions.forEach(itemFunc => {
        this.mapOfExpandedData[itemFunc.id] = this.convertTreeToList(itemFunc, this.isAllExpanded);
      })
      this.getPermissionByRoleId();
    })
  }

  getPermissionByRoleId() {
    this.roleService.getPermissionByRoleId(this.roleId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.resetCheckedPermissions();

          const actionTypes = [
            SystemConstants.VIEW_ACTION,
            SystemConstants.CREATE_ACTION,
            SystemConstants.UPDATE_ACTION,
            SystemConstants.DELETE_ACTION,
            SystemConstants.APPROVE_ACTION
          ];

          this.functions.forEach(itemFunc => {
            actionTypes.forEach(actionType => {
              const hasPermission = res.some(perm => perm.functionId === itemFunc.id && perm.roleId === this.roleId && perm.commandId === actionType);
              const permissionStatus = {
                functionId: itemFunc.id,
                commandId: actionType,
                roleId: this.roleId,
                checked: hasPermission
              };

              switch (actionType) {
                case SystemConstants.VIEW_ACTION:
                  this.checkedViews.push(permissionStatus);
                  break;
                case SystemConstants.CREATE_ACTION:
                  this.checkedCreates.push(permissionStatus);
                  break;
                case SystemConstants.UPDATE_ACTION:
                  this.checkedUpdates.push(permissionStatus);
                  break;
                case SystemConstants.DELETE_ACTION:
                  this.checkedDeletes.push(permissionStatus);
                  break;
                case SystemConstants.APPROVE_ACTION:
                  this.checkedApproves.push(permissionStatus);
                  break;
                default:
                  break; // Khoảng trống cho các trường hợp khác, nếu cần
              }
            });
          });

          // Tạo deep copy của mảng đối tượng
          if (this.checkedViews.length > 0)
          this.changedCheckboxViews = this.checkedViews.map(item => ({ ...item }));
          if (this.checkedCreates.length > 0)
          this.changedCheckboxCreates = this.checkedCreates.map(item => ({ ...item }));
          if (this.checkedUpdates.length > 0)
          this.changedCheckboxUpdates = this.checkedUpdates.map(item => ({ ...item }));
          if (this.checkedDeletes.length > 0)
          this.changedCheckboxDeletes = this.checkedDeletes.map(item => ({ ...item }));
          if (this.checkedApproves.length > 0)
          this.changedCheckboxApproves = this.checkedApproves.map(item => ({ ...item }));
          this.checkInitialCheckAll();
          this.cdr.detectChanges();
        }
      });
  }

  resetCheckedPermissions() {
    this.checkedCreates = [];
    this.checkedUpdates = [];
    this.checkedDeletes = [];
    this.checkedViews = [];
    this.checkedApproves = [];
  }

  back() {
    this.router.navigate([this.urlRole]);
  }

}
