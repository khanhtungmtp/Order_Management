import { Routes } from '@angular/router';
import { LoginComponent } from './admin/pages/login/login.component';
import { LayoutsComponent } from './admin/layouts/layouts.component';
import { BLANK_ROUTES } from './admin/layouts/blank/blank.routes';
import { hasRoleGuardFn } from './_core/guards/auth/hasRole.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/admin/login' },
  {
    path: 'admin/login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'admin',
    component: LayoutsComponent,
    // canActivate: [adminGuardFn],
    // canActivateChild: [adminGuardFn],
    data: {
      title: 'Admin'
    },
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./admin/admin.routes').then((m) => m.ADMIN_ROUTES)
      }
    ]
  },
  {
    path: 'admin/blank',
    children: BLANK_ROUTES,
    data: {
      title: 'Blank',
      headerDisplay: "none"
    }
  },
];
