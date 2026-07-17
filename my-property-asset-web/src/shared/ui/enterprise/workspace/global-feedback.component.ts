import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ConfirmationDialogComponent } from '../../composites/dialog/confirmation-dialog.component';
import { ToastHostComponent } from '../../primitives/toast/toast-host.component';

/**
 * Global confirmation dialog alias — wraps PrimeNG confirm host (no duplicate logic).
 * Selector matches blueprint deliverable naming for UI-IMP-06.
 */
@Component({
  selector: 'app-enterprise-confirmation-dialog',
  imports: [ConfirmationDialogComponent],
  template: `<app-confirmation-dialog />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseConfirmationDialogComponent {}

/** Global toast host alias — success / warning / error / info toasts. */
@Component({
  selector: 'app-enterprise-global-toast',
  imports: [ToastHostComponent],
  template: `<app-toast-host />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseGlobalToastComponent {}
