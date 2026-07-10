import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { ButtonComponent } from '../../primitives/button/button.component';
import { DialogShellComponent } from './dialog-shell.component';

@Component({
  selector: 'app-alert-dialog',
  imports: [ButtonComponent, DialogShellComponent],
  template: `
    <app-dialog-shell
      [title]="title()"
      [visible]="visible()"
      [width]="'28rem'"
      (visibleChange)="visibleChange.emit($event)"
      (hidden)="hidden.emit()"
    >
      <p class="mpa-body-md m-0">{{ message() }}</p>
      <div dialogActions>
        <app-button [label]="acceptLabel()" (clicked)="accepted.emit()" />
      </div>
    </app-dialog-shell>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertDialogComponent {
  readonly title = input.required<string>();
  readonly message = input.required<string>();
  readonly visible = input(false);
  readonly acceptLabel = input('OK');

  readonly visibleChange = output<boolean>();
  readonly hidden = output<void>();
  readonly accepted = output<void>();
}
