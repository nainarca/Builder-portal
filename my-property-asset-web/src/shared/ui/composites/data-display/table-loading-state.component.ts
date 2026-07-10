import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ProgressWrapperComponent } from '../feedback/progress-wrapper.component';

@Component({
  selector: 'app-table-loading-state',
  imports: [ProgressWrapperComponent],
  template: `<app-progress-wrapper />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableLoadingStateComponent {}
