import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { ButtonComponent } from '@shared/ui';

import { DocumentBulkAction } from '../../models/document.model';

@Component({
  selector: 'app-document-bulk-actions',
  imports: [ButtonComponent],
  template: `
    @if (count() > 0) {
      <div class="doc-bulk-actions" role="toolbar" aria-label="Bulk actions">
        <span class="doc-bulk-actions__count">{{ count() }} selected</span>
        <app-button label="Archive" icon="pi pi-archive" size="small" severity="danger" [outlined]="true" (clicked)="action.emit('archive')" />
        <app-button label="Restore" icon="pi pi-replay" size="small" [outlined]="true" (clicked)="action.emit('restore')" />
        <app-button label="Export" icon="pi pi-download" size="small" [outlined]="true" (clicked)="action.emit('export')" />
        <app-button label="Clear" icon="pi pi-times" size="small" [text]="true" (clicked)="clear.emit()" />
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentBulkActionsComponent {
  readonly count = input(0);

  readonly action = output<DocumentBulkAction>();
  readonly clear = output<void>();
}
