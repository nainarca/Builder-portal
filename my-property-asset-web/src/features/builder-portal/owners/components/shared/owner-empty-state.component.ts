import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { EmptyStateComponent } from '@shared/ui';

@Component({
  selector: 'app-owner-empty-state',
  imports: [EmptyStateComponent],
  template: `
    <app-empty-state
      [title]="title()"
      [description]="description()"
      icon="users"
      [actionLabel]="actionLabel()"
      (action)="action.emit($event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerEmptyStateComponent {
  readonly title = input('No owners yet');
  readonly description = input('Assign your first owner to a unit to start tracking invitations.');
  readonly actionLabel = input<string | undefined>('Assign owner');

  readonly action = output<MouseEvent>();
}
