import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SpinnerComponent } from '../../primitives/spinner/spinner.component';

@Component({
  selector: 'app-progress-wrapper',
  imports: [SpinnerComponent],
  template: `
    <div class="ui-progress-wrapper" role="status" aria-live="polite">
      <app-spinner ariaLabel="Loading content" />
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressWrapperComponent {}
