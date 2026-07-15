import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { ProjectViewMode } from '../../services/project-list-state.service';

@Component({
  selector: 'app-proj-view-toggle',
  template: `
    <div class="proj-view-toggle" role="group" aria-label="Toggle view">
      <button
        type="button"
        class="proj-view-toggle__btn"
        [class.proj-view-toggle__btn--active]="mode() === 'table'"
        [attr.aria-pressed]="mode() === 'table'"
        aria-label="Table view"
        (click)="modeChange.emit('table')"
      >
        <i class="pi pi-table" aria-hidden="true"></i>
      </button>
      <button
        type="button"
        class="proj-view-toggle__btn"
        [class.proj-view-toggle__btn--active]="mode() === 'card'"
        [attr.aria-pressed]="mode() === 'card'"
        aria-label="Card view"
        (click)="modeChange.emit('card')"
      >
        <i class="pi pi-th-large" aria-hidden="true"></i>
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectViewToggleComponent {
  readonly mode = input.required<ProjectViewMode>();

  readonly modeChange = output<ProjectViewMode>();
}
