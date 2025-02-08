import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SYSTEM_ROUTES } from './system/system.routes';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: {
      title: 'Dashboard',
      headerDisplay: "none"
    }
  },
  {
    path: 'system',
    children: SYSTEM_ROUTES,
    data: {
      title: 'system',
      headerDisplay: "none"
    }
  }
];
