import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalStorageConstants } from '@constants/local-storage.constants';
import { FunctionUtility } from '@utilities/function-utility';
import { PermissionService } from '@services/auth/permission.service';
import { AuthResponse } from '@app/_core/models/auth/auth-response';

const navigateToUnauthorized = (router: Router, functionUtility: FunctionUtility) => {
  functionUtility.snotifySuccessError(false, 'system.message.unauthorized');
  router.navigate(['/admin/dashboard']);
};

const navigateToLogin = (router: Router, functionUtility: FunctionUtility, returnUrl: string) => {
  functionUtility.snotifySuccessError(false, 'system.message.unauthorized');
  router.navigate(['/admin/login'], { queryParams: { returnUrl } });
};


export const hasRoleGuardFn: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const functionUtility = inject(FunctionUtility);
  const permissionsService = inject(PermissionService);

  const isResetPassword: boolean = functionUtility.getLocalStorageItem<boolean>(LocalStorageConstants.IS_RESET_PASSWORD);
  const loggedInUser: AuthResponse = functionUtility.getLoggedInUser();
  const permissions: string[] = loggedInUser.permissions || [];
  const programCode = route.data["programCode"] as string;
  const acceptActions: string[] = ['add', 'edit', 'rehire'];
  const url: string[] = state?.url.split('/'); // Lấy URL hiện tại
  const action: string = url[url.length - 1];
  const acceptAction: boolean = acceptActions.includes(action);
  if (loggedInUser && Object.keys(loggedInUser).length > 0) {
    // case reset password
    if (isResetPassword) {
      // const roleOfUser = loggedInUser.permissions || [];
      // const userProgram = roleOfUser.find(x => x === 'BAS107');
      // const parent = userProgram?.subsys.toLowerCase();
      // const child = userProgram?.program_Code.toLowerCase();

      if (programCode !== 'bas107') {
        functionUtility.snotifySuccessError(false, 'system.message.pleaseChangePassword');
        // router.navigate([`/${parent}/${child}`]);
        return false;
      }
      return true;
    }

    // else all case check permission main
    if (permissions) {
      const hasBasicPermission: boolean = permissions.some(permission => permission.startsWith(programCode));
      const hasSpecificPermission: boolean = permissions.includes(`${programCode}:${action}`);
      // permission main
      if (hasBasicPermission && !acceptAction) {
        permissionsService.setCurrentProgramCode(programCode);
        return true;
      }
      // permission form
      if (acceptAction && hasSpecificPermission) {
        permissionsService.setCurrentProgramCode(programCode);
        return true;
      }
    }

    navigateToUnauthorized(router, functionUtility);
    return false;

  } else {
    navigateToLogin(router, functionUtility, state.url);
    return false;
  }
};
