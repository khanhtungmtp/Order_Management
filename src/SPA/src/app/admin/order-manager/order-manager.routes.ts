import { Route, Routes } from '@angular/router';
import { ActionCode } from '@app/_core/constants/actionCode';
import { hasRoleGuardFn } from '@app/_core/guards/auth/hasRole.guard';
import { MainComponent } from './main/main.component';

export default [
  {
    path: '',
    component: MainComponent,
    title: 'Function',
    data: {
      title: 'Function',
      actionCode: ActionCode.FunctionView,
    },
  }
] as Route[];
