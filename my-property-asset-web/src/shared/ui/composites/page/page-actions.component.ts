import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-page-actions',
  template: `<div class="ui-page-actions"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageActionsComponent {}
