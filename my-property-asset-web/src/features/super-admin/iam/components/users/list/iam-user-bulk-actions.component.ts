import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { ButtonComponent } from '@shared/ui';

import { UserBulkAction } from '../../../models/user-admin.model';

@Component({
  selector: 'app-iam-user-bulk-actions',
  imports: [ButtonComponent],
  template: `
    @if (count() > 0) {
      <div class="iam-bulk-actions" role="toolbar" aria-label="Bulk actions">
        <span class="iam-bulk-actions__count">{{ count() }} selected</span>
        <app-button label="Activate" icon="pi pi-check" [text]="true" (clicked)="action.emit('activate')" />
        <app-button label="Deactivate" icon="pi pi-minus" [text]="true" (clicked)="action.emit('deactivate')" />
        <app-button label="Suspend" icon="pi pi-ban" [text]="true" (clicked)="action.emit('suspend')" />
        <app-button label="Archive" icon="pi pi-archive" [text]="true" (clicked)="action.emit('archive')" />
        <app-button label="Export" icon="pi pi-download" [text]="true" (clicked)="action.emit('export')" />
        <app-button label="Clear" [text]="true" (clicked)="clear.emit()" />
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IamUserBulkActionsComponent {
  readonly count = input(0);
  readonly action = output<UserBulkAction>();
  readonly clear = output<void>();
}
