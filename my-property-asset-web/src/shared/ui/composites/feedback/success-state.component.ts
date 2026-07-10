import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { FeedbackStateComponent } from './feedback-state.component';

@Component({
  selector: 'app-success-state',
  imports: [FeedbackStateComponent],
  template: `
    <app-feedback-state
      [title]="title()"
      [description]="description()"
      icon="check-circle"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuccessStateComponent {
  readonly title = input('Success');
  readonly description = input<string | undefined>(undefined);
}
