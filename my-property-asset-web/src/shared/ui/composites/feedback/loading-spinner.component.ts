import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SpinnerComponent } from '../../primitives/spinner/spinner.component';

@Component({
  selector: 'app-loading-spinner',
  imports: [SpinnerComponent],
  template: `<app-spinner [ariaLabel]="'Loading'" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingSpinnerComponent {}
