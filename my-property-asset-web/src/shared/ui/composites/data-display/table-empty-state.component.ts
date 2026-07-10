import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { EmptyStateComponent } from '../feedback/empty-state.component';

@Component({
  selector: 'app-table-empty-state',
  imports: [EmptyStateComponent],
  template: `
    <app-empty-state
      [title]="title()"
      [description]="description()"
      [actionLabel]="actionLabel()"
      (action)="action.emit($event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableEmptyStateComponent {
  readonly title = input('No records');
  readonly description = input<string | undefined>('There are no records to display.');
  readonly actionLabel = input<string | undefined>(undefined);

  readonly action = output<MouseEvent>();
}
