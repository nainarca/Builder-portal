import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { EmptyStateComponent } from '@shared/ui';

@Component({
  selector: 'app-unit-empty-state',
  imports: [EmptyStateComponent],
  template: `
    <app-empty-state
      [title]="title()"
      [description]="description()"
      icon="home"
      [actionLabel]="actionLabel()"
      (action)="action.emit($event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnitEmptyStateComponent {
  readonly title = input('No units yet');
  readonly description = input('Add the first unit to start tracking construction progress for this project.');
  readonly actionLabel = input<string | undefined>('Create unit');

  readonly action = output<MouseEvent>();
}
