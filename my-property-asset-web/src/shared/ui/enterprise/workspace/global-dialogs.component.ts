import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { DialogShellComponent } from '../../composites/dialog/dialog-shell.component';
import { EnterpriseButtonComponent } from '../buttons/enterprise-button.component';

/** Success dialog — presentation only. */
@Component({
  selector: 'app-success-dialog',
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
        <app-enterprise-button variant="primary" [label]="acceptLabel()" (clicked)="accepted.emit()" />
      </div>
    </app-dialog-shell>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuccessDialogComponent {
  readonly title = input('Success');
  readonly message = input.required<string>();
  readonly visible = input(false);
  readonly acceptLabel = input('OK');
  readonly visibleChange = output<boolean>();
  readonly hidden = output<void>();
  readonly accepted = output<void>();
}

/** Warning dialog — presentation only. */
@Component({
  selector: 'app-warning-dialog',
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
        <app-enterprise-button variant="primary" [label]="confirmLabel()" (clicked)="confirmed.emit()" />
      </div>
    </app-dialog-shell>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WarningDialogComponent {
  readonly title = input('Warning');
  readonly message = input.required<string>();
  readonly visible = input(false);
  readonly confirmLabel = input('Continue');
  readonly cancelLabel = input('Cancel');
  readonly visibleChange = output<boolean>();
  readonly hidden = output<void>();
  readonly confirmed = output<void>();
  readonly cancelled = output<void>();
}
