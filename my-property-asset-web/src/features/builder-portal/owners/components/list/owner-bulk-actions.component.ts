import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { ButtonComponent } from '@shared/ui';

import { OwnerBulkAction } from '../../models/owner.model';

@Component({
  selector: 'app-owner-bulk-actions',
  imports: [ButtonComponent],
  template: `
    @if (count() > 0) {
      <div class="owner-bulk-actions" role="toolbar" aria-label="Bulk actions">
        <span class="owner-bulk-actions__count">{{ count() }} selected</span>
        <app-button label="Archive" icon="pi pi-archive" size="small" severity="danger" [outlined]="true" (clicked)="action.emit('archive')" />
        <app-button label="Restore" icon="pi pi-replay" size="small" [outlined]="true" (clicked)="action.emit('restore')" />
        <app-button label="Export" icon="pi pi-download" size="small" [outlined]="true" (clicked)="action.emit('export')" />
        <app-button label="Clear" icon="pi pi-times" size="small" [text]="true" (clicked)="clear.emit()" />
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerBulkActionsComponent {
  readonly count = input(0);

  readonly action = output<OwnerBulkAction>();
  readonly clear = output<void>();
}
