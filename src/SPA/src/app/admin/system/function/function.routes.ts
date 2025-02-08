import { Route } from '@angular/router';

import { FunctionComponent } from './function.component';
import { ActionCode } from '@app/_core/constants/actionCode';

export default [
  {
    path: '',
    component: FunctionComponent,
    title: 'Function',
    data: {
      title: 'Function',
      actionCode: ActionCode.FunctionView,
    },
  }
] as Route[];
