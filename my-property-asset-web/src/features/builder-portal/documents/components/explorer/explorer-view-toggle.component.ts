import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { DocumentViewMode } from '../../models/document.model';

@Component({
  selector: 'app-explorer-view-toggle',
  template: `
    <div class="doc-view-toggle" role="group" aria-label="Toggle view">
      <button
        type="button"
        class="doc-view-toggle__btn"
        [class.doc-view-toggle__btn--active]="mode() === 'grid'"
        [attr.aria-pressed]="mode() === 'grid'"
        aria-label="Grid view"
        (click)="modeChange.emit('grid')"
      >
        <i class="pi pi-th-large" aria-hidden="true"></i>
      </button>
      <button
        type="button"
        class="doc-view-toggle__btn"
        [class.doc-view-toggle__btn--active]="mode() === 'list'"
        [attr.aria-pressed]="mode() === 'list'"
        aria-label="List view"
        (click)="modeChange.emit('list')"
      >
        <i class="pi pi-bars" aria-hidden="true"></i>
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExplorerViewToggleComponent {
  readonly mode = input.required<DocumentViewMode>();

  readonly modeChange = output<DocumentViewMode>();
}
