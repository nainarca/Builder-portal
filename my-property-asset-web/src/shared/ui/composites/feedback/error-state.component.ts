import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { FeedbackStateComponent } from './feedback-state.component';

@Component({
  selector: 'app-error-state',
  imports: [FeedbackStateComponent],
  template: `
    <app-feedback-state
      [title]="title()"
      [description]="description()"
      icon="exclamation-triangle"
      [actionLabel]="actionLabel()"
      (action)="action.emit($event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorStateComponent {
  readonly title = input('Something went wrong');
  readonly description = input<string | undefined>(
    'We could not load this content. Please try again.',
  );
  readonly actionLabel = input<string | undefined>('Retry');

  readonly action = output<MouseEvent>();
}
