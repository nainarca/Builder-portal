import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { EmptyStateComponent } from '@shared/ui';

@Component({
  selector: 'app-completion-empty-state',
  imports: [EmptyStateComponent],
  template: `
    <app-empty-state [title]="title()" [description]="description()" icon="check-circle" [actionLabel]="undefined" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompletionEmptyStateComponent {
  readonly title = input('Not ready for completion yet');
  readonly description = input('This handover must be approved before it can be finalized.');
}
