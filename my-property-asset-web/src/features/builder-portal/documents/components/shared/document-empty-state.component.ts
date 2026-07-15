import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { EmptyStateComponent } from '@shared/ui';

@Component({
  selector: 'app-document-empty-state',
  imports: [EmptyStateComponent],
  template: `
    <app-empty-state
      [title]="title()"
      [description]="description()"
      icon="file"
      [actionLabel]="actionLabel()"
      (action)="action.emit($event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentEmptyStateComponent {
  readonly title = input('No documents yet');
  readonly description = input('Documents added to this project or unit will appear here.');
  readonly actionLabel = input<string | undefined>('Add document');

  readonly action = output<MouseEvent>();
}
