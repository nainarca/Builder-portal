import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { ButtonComponent } from '@shared/ui';

import { OrganizationBulkAction } from '../../models/organization-admin.model';

@Component({
  selector: 'app-org-bulk-actions',
  imports: [ButtonComponent],
  template: `
    @if (count() > 0) {
      <div class="org-bulk-actions" role="toolbar" aria-label="Bulk actions">
        <span class="org-bulk-actions__count">{{ count() }} selected</span>
        <app-button label="Activate" icon="pi pi-check" size="small" [outlined]="true" (clicked)="action.emit('activate')" />
        <app-button label="Deactivate" icon="pi pi-pause" size="small" [outlined]="true" (clicked)="action.emit('deactivate')" />
        <app-button label="Archive" icon="pi pi-archive" size="small" severity="danger" [outlined]="true" (clicked)="action.emit('archive')" />
        <app-button label="Export" icon="pi pi-download" size="small" [outlined]="true" (clicked)="action.emit('export')" />
        <app-button label="Clear" icon="pi pi-times" size="small" [text]="true" (clicked)="clear.emit()" />
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationBulkActionsComponent {
  readonly count = input(0);

  readonly action = output<OrganizationBulkAction>();
  readonly clear = output<void>();
}
