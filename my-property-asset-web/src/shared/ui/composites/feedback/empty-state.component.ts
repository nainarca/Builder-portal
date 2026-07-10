import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { FeedbackStateComponent } from './feedback-state.component';

@Component({
  selector: 'app-empty-state',
  imports: [FeedbackStateComponent],
  template: `
    <app-feedback-state
      [title]="title()"
      [description]="description()"
      [icon]="icon()"
      [actionLabel]="actionLabel()"
      (action)="action.emit($event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyStateComponent {
  readonly title = input('Nothing here yet');
  readonly description = input<string | undefined>(
    'Get started by creating your first item.',
  );
  readonly icon = input('inbox');
  readonly actionLabel = input<string | undefined>('Create');

  readonly action = output<MouseEvent>();
}
