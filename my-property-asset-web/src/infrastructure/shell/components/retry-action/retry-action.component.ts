import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { ButtonComponent } from '../../../../shared/ui';

@Component({
  selector: 'app-retry-action',
  imports: [ButtonComponent],
  template: `
    <app-button
      [label]="label()"
      icon="pi pi-refresh"
      [loading]="loading()"
      (clicked)="retry.emit()"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RetryActionComponent {
  readonly label = input('Retry');
  readonly loading = input(false);

  readonly retry = output<void>();
}
