import { inject, Injectable } from '@angular/core';

import { NzIconService } from 'ng-zorro-antd/icon';

// Get Alibaba icon library
@Injectable({
  providedIn: 'root'
})
export class LoadAliIconCdnService {
  private iconService = inject(NzIconService);

  load(): void {
    // This js you have to go to the official website of the Alibaba icon library to generate yourself
    this.iconService.fetchFromIconfont({
      scriptUrl: 'https://at.alicdn.com/t/font_3303907_htrdo3n69kc.js'
    });
  }
}
