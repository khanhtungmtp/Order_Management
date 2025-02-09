import { Route, Routes } from '@angular/router';
import { ActionCode } from '@app/_core/constants/actionCode';
import { hasRoleGuardFn } from '@app/_core/guards/auth/hasRole.guard';
import { MainComponent } from './main/main.component';

export default [
  {
    path: '',
    component: MainComponent,
    title: 'ORDER MANAGEMENT',
    data: {
      title: 'ORDER MANAGEMENT',
      actionCode: ActionCode.OrderView,
    },
  }
] as Route[];
