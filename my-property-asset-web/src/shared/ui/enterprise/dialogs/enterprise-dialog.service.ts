import { Injectable, inject } from '@angular/core';

import { UiDialogService } from '../../services/ui-dialog.service';

/** Imperative confirmation helpers for DS-03 dialogs (presentation only). */
@Injectable({ providedIn: 'root' })
export class EnterpriseDialogService {
  private readonly dialogs = inject(UiDialogService);

  confirm(title: string, message: string): Promise<boolean> {
    return this.dialogs.confirm({
      title,
      message,
      acceptLabel: 'Confirm',
      rejectLabel: 'Cancel',
    });
  }

  confirmDelete(entityLabel: string): Promise<boolean> {
    return this.dialogs.confirm({
      title: 'Delete',
      message: `Delete ${entityLabel}? This action cannot be undone.`,
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      acceptSeverity: 'danger',
      icon: 'pi pi-trash',
    });
  }

  confirmApproval(title: string, message: string): Promise<boolean> {
    return this.dialogs.confirm({
      title,
      message,
      acceptLabel: 'Approve',
      rejectLabel: 'Reject',
      acceptSeverity: 'success',
      icon: 'pi pi-check',
    });
  }
}
