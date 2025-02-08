import { Route } from '@angular/router';
import { RoleManagerComponent } from './role-manager.component';
import { RoleManagerDetailComponent } from './role-manager-detail/role-manager-detail.component';

export default [
  {
    path: '',
    component: RoleManagerComponent,
    title: 'Role manager',
    data: { key: 'role' }
  },
  {
    path: ':roleId',
    component: RoleManagerDetailComponent,
    title: 'Role detail',
    data: { key: 'role detail' }
  }
] as Route[];
