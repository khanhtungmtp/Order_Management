import { Routes } from '@angular/router';
import { ActionCode } from '@app/_core/constants/actionCode';
import { hasRoleGuardFn } from '@app/_core/guards/auth/hasRole.guard';
export const SYSTEM_ROUTES: Routes = [
  {
    path: 'function',
    canActivate: [hasRoleGuardFn],
    data: {
      title: 'Function',
      programCode: ActionCode.FunctionView,
    },
    loadChildren: () => import('./function/function.routes')
  },
  {
    path: 'language',
    canActivate: [hasRoleGuardFn],
    data: {
      title: 'Language',
      programCode: ActionCode.LanguageView,
    },
    loadChildren: () => import('./language/language.routes')
  },
  {
    path: 'user-manager',
    canActivate: [hasRoleGuardFn],
    data: {
      title: 'User manager',
      programCode: ActionCode.UserManagerView,
    },
    loadChildren: () => import('./user-manager/user-manager.routes')
  },
  {
    path: 'role',
    canActivate: [hasRoleGuardFn],
    data: {
      title: 'Role manager',
      programCode: ActionCode.RoleManagerView,
    },
    loadChildren: () => import('./role-manager/role-manager.routes')
  },

];
