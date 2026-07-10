import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-form-actions',
  template: `<div class="ui-form-actions"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormActionsComponent {}
