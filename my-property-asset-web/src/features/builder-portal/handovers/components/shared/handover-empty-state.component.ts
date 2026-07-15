import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { EmptyStateComponent } from '@shared/ui';

@Component({
  selector: 'app-handover-empty-state',
  imports: [EmptyStateComponent],
  template: `
    <app-empty-state
      [title]="title()"
      [description]="description()"
      icon="flag"
      [actionLabel]="undefined"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HandoverEmptyStateComponent {
  readonly title = input('No handovers match your filters');
  readonly description = input('Try adjusting your search or filters.');
}
