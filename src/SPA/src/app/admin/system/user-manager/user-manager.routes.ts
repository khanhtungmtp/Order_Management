import { Route } from '@angular/router';
import { UserManagerComponent } from './user-manager.component';

export default [
  {
    path: '',
    component: UserManagerComponent,
    title: 'User manager',
    data: { key: 'user' }
  }
] as Route[];
