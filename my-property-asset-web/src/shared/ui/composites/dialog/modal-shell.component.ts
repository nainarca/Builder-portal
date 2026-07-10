import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { DialogShellComponent } from './dialog-shell.component';

@Component({
  selector: 'app-modal-shell',
  imports: [DialogShellComponent],
  template: `
    <app-dialog-shell
      [title]="title()"
      [visible]="visible()"
      [width]="width()"
      [modal]="true"
      [showFooter]="showFooter()"
      (visibleChange)="visibleChange.emit($event)"
      (hidden)="hidden.emit()"
    >
      <ng-content />
      <div dialogActions>
        <ng-content select="[modalActions]" />
      </div>
    </app-dialog-shell>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalShellComponent {
  readonly title = input<string | undefined>(undefined);
  readonly visible = input(false);
  readonly width = input('40rem');
  readonly showFooter = input(true);

  readonly visibleChange = output<boolean>();
  readonly hidden = output<void>();
}
