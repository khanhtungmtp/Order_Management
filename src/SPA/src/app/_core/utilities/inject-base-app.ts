import { TranslateService } from '@ngx-translate/core';
import { inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DestroyService } from "@services/destroy.service";
import { FunctionUtility } from "@utilities/function-utility";
import { NzNotificationCustomService } from '@services/nz-notificationCustom.service';
import { NzSpinnerCustomService } from '@services/common/nz-spinner.service';
export abstract class InjectBase {
  protected router: Router = inject(Router);
  protected route: ActivatedRoute = inject(ActivatedRoute);
  protected translateService: TranslateService = inject(TranslateService);
  protected destroyService: DestroyService = inject(DestroyService);
  protected functionUtility: FunctionUtility = inject(FunctionUtility);
  protected notification: NzNotificationCustomService = inject(NzNotificationCustomService);
  protected spinnerService: NzSpinnerCustomService = inject(NzSpinnerCustomService);
}
