import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { GlobalErrorBoundaryService } from '../../../error-handling';
import { AlertDialogComponent } from '@shared/ui';

@Component({
  selector: 'app-error-dialog-host',
  imports: [AlertDialogComponent],
  template: `
    @if (dialog(); as state) {
      <app-alert-dialog
        [title]="state.title"
        [message]="state.message"
        [visible]="true"
        [acceptLabel]="state.retryable ? 'Retry' : 'Close'"
        (accepted)="onAccept(state.retryable)"
        (visibleChange)="onVisibleChange($event)"
      />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorDialogHostComponent {
  private readonly errorBoundary = inject(GlobalErrorBoundaryService);

  readonly dialog = this.errorBoundary.dialog;

  onAccept(retryable: boolean): void {
    if (retryable) {
      window.location.reload();
    }
    this.errorBoundary.dismissDialog();
  }

  onVisibleChange(visible: boolean): void {
    if (!visible) {
      this.errorBoundary.dismissDialog();
    }
  }
}
