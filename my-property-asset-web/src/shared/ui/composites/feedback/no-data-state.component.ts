import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { FeedbackStateComponent } from './feedback-state.component';

@Component({
  selector: 'app-no-data-state',
  imports: [FeedbackStateComponent],
  template: `
    <app-feedback-state
      [title]="title()"
      [description]="description()"
      icon="search"
      [actionLabel]="actionLabel()"
      (action)="action.emit($event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoDataStateComponent {
  readonly title = input('No results found');
  readonly description = input<string | undefined>(
    'Try adjusting your search or filter criteria.',
  );
  readonly actionLabel = input<string | undefined>('Clear filters');

  readonly action = output<MouseEvent>();
}
