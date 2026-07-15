import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { EmptyStateComponent } from '@shared/ui';

@Component({
  selector: 'app-proj-empty-state',
  imports: [EmptyStateComponent],
  template: `
    <app-empty-state
      [title]="title()"
      [description]="description()"
      icon="briefcase"
      [actionLabel]="actionLabel()"
      (action)="action.emit($event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectEmptyStateComponent {
  readonly title = input('No projects yet');
  readonly description = input('Create your first project to start tracking construction progress.');
  readonly actionLabel = input<string | undefined>('Create project');

  readonly action = output<MouseEvent>();
}
