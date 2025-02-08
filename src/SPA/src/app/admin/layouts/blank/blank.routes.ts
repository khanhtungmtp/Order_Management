import { Routes } from '@angular/router';
import { BlankComponent } from './blank.component';
import { EmptyForLockComponent } from '../../shared/components/empty-for-lock/empty-for-lock.component';

export const BLANK_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/admin/login' },
  {
    path: '',
    component: BlankComponent,
    data: {
      title: 'Lock screen page'
    },
    children: [
      {
        title: 'Lock screen',
        path: 'empty-for-lock',
        canDeactivate: [(component: EmptyForLockComponent) => !component.routeStatus.locked],
        data: { key: 'empty-for-lock', shouldDetach: 'no' },
        loadComponent: () => import('../../shared/components/empty-for-lock/empty-for-lock.component').then(m => m.EmptyForLockComponent)
      },
    ]
  }
];
