import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { FeedbackStateComponent } from './feedback-state.component';

@Component({
  selector: 'app-maintenance-state',
  imports: [FeedbackStateComponent],
  template: `
    <app-feedback-state
      [title]="title()"
      [description]="description()"
      icon="wrench"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaintenanceStateComponent {
  readonly title = input('Under maintenance');
  readonly description = input<string | undefined>(
    'We are performing scheduled maintenance. Please check back shortly.',
  );
}
