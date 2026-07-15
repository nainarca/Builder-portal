import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { ButtonComponent } from '@shared/ui';

import { UnitBulkAction } from '../../models/unit.model';

@Component({
  selector: 'app-unit-bulk-actions',
  imports: [ButtonComponent],
  template: `
    @if (count() > 0) {
      <div class="unit-bulk-actions" role="toolbar" aria-label="Bulk actions">
        <span class="unit-bulk-actions__count">{{ count() }} selected</span>
        <app-button label="Archive" icon="pi pi-archive" size="small" severity="danger" [outlined]="true" (clicked)="action.emit('archive')" />
        <app-button label="Restore" icon="pi pi-replay" size="small" [outlined]="true" (clicked)="action.emit('restore')" />
        <app-button label="Export" icon="pi pi-download" size="small" [outlined]="true" (clicked)="action.emit('export')" />
        <app-button label="Clear" icon="pi pi-times" size="small" [text]="true" (clicked)="clear.emit()" />
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnitBulkActionsComponent {
  readonly count = input(0);

  readonly action = output<UnitBulkAction>();
  readonly clear = output<void>();
}
