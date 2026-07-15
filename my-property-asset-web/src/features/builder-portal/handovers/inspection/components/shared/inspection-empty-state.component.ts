import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { EmptyStateComponent } from '@shared/ui';

@Component({
  selector: 'app-inspection-empty-state',
  imports: [EmptyStateComponent],
  template: `
    <app-empty-state [title]="title()" [description]="description()" icon="check-square" [actionLabel]="undefined" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InspectionEmptyStateComponent {
  readonly title = input('No inspections found');
  readonly description = input('No inspection categories have been set up for this handover yet.');
}
