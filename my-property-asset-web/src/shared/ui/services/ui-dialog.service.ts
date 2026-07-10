import { Injectable, inject } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

import { ConfirmationDialogConfig } from '../models';

@Injectable({ providedIn: 'root' })
export class UiDialogService {
  private readonly confirmationService = inject(ConfirmationService);

  confirm(config: ConfirmationDialogConfig): Promise<boolean> {
    return new Promise((resolve) => {
      this.confirmationService.confirm({
        header: config.title,
        message: config.message,
        icon: config.icon,
        acceptLabel: config.acceptLabel ?? 'Confirm',
        rejectLabel: config.rejectLabel ?? 'Cancel',
        acceptButtonStyleClass: config.acceptSeverity
          ? `p-button-${config.acceptSeverity}`
          : undefined,
        rejectButtonStyleClass: config.rejectSeverity
          ? `p-button-${config.rejectSeverity}`
          : undefined,
        accept: () => resolve(true),
        reject: () => resolve(false),
      });
    });
  }
}
