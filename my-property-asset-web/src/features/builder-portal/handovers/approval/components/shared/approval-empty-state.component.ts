import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { EmptyStateComponent } from '@shared/ui';

@Component({
  selector: 'app-approval-empty-state',
  imports: [EmptyStateComponent],
  template: `
    <app-empty-state [title]="title()" [description]="description()" icon="verified" [actionLabel]="undefined" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApprovalEmptyStateComponent {
  readonly title = input('No approval record found');
  readonly description = input('This handover does not have an approval workflow yet.');
}
