import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { ButtonComponent } from '../../primitives/button/button.component';
import { AlertDialogComponent } from '../../composites/dialog/alert-dialog.component';
import { ConfirmationDialogComponent } from '../../composites/dialog/confirmation-dialog.component';
import { DialogShellComponent } from '../../composites/dialog/dialog-shell.component';
import { DrawerShellComponent } from '../../composites/dialog/drawer-shell.component';
import { ModalShellComponent } from '../../composites/dialog/modal-shell.component';
import { EnterpriseButtonComponent } from '../buttons/enterprise-button.component';

@Component({
  selector: 'app-confirmation-dialog-host',
  imports: [ConfirmationDialogComponent],
  template: `<app-confirmation-dialog />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationDialogHostComponent {}

@Component({
  selector: 'app-delete-dialog',
  imports: [DialogShellComponent, EnterpriseButtonComponent],
  template: `
    <app-dialog-shell
      [title]="title()"
      [visible]="visible()"
      width="28rem"
      (visibleChange)="visibleChange.emit($event)"
      (hidden)="hidden.emit()"
    >
      <p class="mpa-body-md m-0">{{ message() }}</p>
      <div dialogActions>
        <app-enterprise-button variant="ghost" [label]="cancelLabel()" (clicked)="cancelled.emit()" />
        <app-enterprise-button variant="danger" [label]="confirmLabel()" (clicked)="confirmed.emit()" />
      </div>
    </app-dialog-shell>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteDialogComponent {
  readonly title = input('Delete');
  readonly message = input.required<string>();
  readonly visible = input(false);
  readonly confirmLabel = input('Delete');
  readonly cancelLabel = input('Cancel');
  readonly visibleChange = output<boolean>();
  readonly hidden = output<void>();
  readonly confirmed = output<void>();
  readonly cancelled = output<void>();
}

@Component({
  selector: 'app-approval-dialog',
  imports: [DialogShellComponent, EnterpriseButtonComponent],
  template: `
    <app-dialog-shell
      [title]="title()"
      [visible]="visible()"
      width="28rem"
      (visibleChange)="visibleChange.emit($event)"
      (hidden)="hidden.emit()"
    >
      <p class="mpa-body-md m-0">{{ message() }}</p>
      <div dialogActions>
        <app-enterprise-button variant="ghost" [label]="rejectLabel()" (clicked)="rejected.emit()" />
        <app-enterprise-button variant="success" [label]="approveLabel()" (clicked)="approved.emit()" />
      </div>
    </app-dialog-shell>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApprovalDialogComponent {
  readonly title = input('Approve');
  readonly message = input.required<string>();
  readonly visible = input(false);
  readonly approveLabel = input('Approve');
  readonly rejectLabel = input('Reject');
  readonly visibleChange = output<boolean>();
  readonly hidden = output<void>();
  readonly approved = output<void>();
  readonly rejected = output<void>();
}

@Component({
  selector: 'app-information-dialog',
  imports: [AlertDialogComponent],
  template: `
    <app-alert-dialog
      [title]="title()"
      [message]="message()"
      [visible]="visible()"
      [acceptLabel]="acceptLabel()"
      (visibleChange)="visibleChange.emit($event)"
      (hidden)="hidden.emit()"
      (accepted)="accepted.emit()"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InformationDialogComponent {
  readonly title = input.required<string>();
  readonly message = input.required<string>();
  readonly visible = input(false);
  readonly acceptLabel = input('OK');
  readonly visibleChange = output<boolean>();
  readonly hidden = output<void>();
  readonly accepted = output<void>();
}

@Component({
  selector: 'app-side-drawer',
  imports: [DrawerShellComponent],
  template: `
    <app-drawer-shell
      [title]="title()"
      [visible]="visible()"
      [position]="position()"
      [size]="size()"
      [modal]="modal()"
      [dismissible]="dismissible()"
      (visibleChange)="visibleChange.emit($event)"
      (hidden)="hidden.emit()"
    >
      <ng-content />
    </app-drawer-shell>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideDrawerComponent {
  readonly title = input<string | undefined>(undefined);
  readonly visible = input(false);
  readonly position = input<'left' | 'right' | 'top' | 'bottom'>('right');
  readonly size = input('28rem');
  readonly modal = input(true);
  readonly dismissible = input(true);
  readonly visibleChange = output<boolean>();
  readonly hidden = output<void>();
}

@Component({
  selector: 'app-preview-dialog',
  imports: [ModalShellComponent, ButtonComponent],
  template: `
    <app-modal-shell
      [title]="title()"
      [visible]="visible()"
      [width]="width()"
      (visibleChange)="visibleChange.emit($event)"
      (hidden)="hidden.emit()"
    >
      <ng-content />
      <div modalActions>
        <app-button [label]="closeLabel()" [text]="true" (clicked)="closed.emit()" />
      </div>
    </app-modal-shell>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewDialogComponent {
  readonly title = input('Preview');
  readonly visible = input(false);
  readonly width = input('40rem');
  readonly closeLabel = input('Close');
  readonly visibleChange = output<boolean>();
  readonly hidden = output<void>();
  readonly closed = output<void>();
}
