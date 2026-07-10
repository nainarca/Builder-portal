import { ChangeDetectionStrategy, Component, output } from '@angular/core';

import { ErrorStateComponent } from '../../../../shared/ui';

@Component({
  selector: 'app-empty-error-state',
  imports: [ErrorStateComponent],
  template: `
    <app-error-state
      [title]="title"
      [description]="description"
      [actionLabel]="actionLabel"
      (action)="retry.emit($event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyErrorStateComponent {
  readonly title = 'Unable to load content';
  readonly description = 'An error occurred while loading this section.';
  readonly actionLabel = 'Retry';

  readonly retry = output<MouseEvent>();
}
