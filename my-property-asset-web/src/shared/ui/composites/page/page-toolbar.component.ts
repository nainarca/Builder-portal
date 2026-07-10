import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-page-toolbar',
  template: `<div class="ui-page-toolbar"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageToolbarComponent {}
