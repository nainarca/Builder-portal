import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-base-page',
  template: `<div class="ui-base-page"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasePageComponent {}
