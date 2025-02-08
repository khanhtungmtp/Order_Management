import { Route } from '@angular/router';
import { LanguageComponent } from './language.component';

export default [
  {
    path: '',
    component: LanguageComponent,
    title: 'Language manager',
    data: { key: 'language' }
  }
] as Route[];
