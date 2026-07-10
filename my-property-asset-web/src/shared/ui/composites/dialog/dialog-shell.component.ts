import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'app-dialog-shell',
  imports: [Dialog],
  template: `
    <p-dialog
      [header]="title()"
      [visible]="visible()"
      [modal]="modal()"
      [closable]="true"
      [style]="{ width: width() }"
      [breakpoints]="{ '960px': '90vw', '640px': '95vw' }"
      (visibleChange)="visibleChange.emit($event)"
      (onHide)="hidden.emit()"
    >
      <ng-content />
      @if (showFooter()) {
        <ng-template pTemplate="footer">
          <ng-content select="[dialogActions]" />
        </ng-template>
      }
    </p-dialog>
  `,
  styleUrl: './dialog-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogShellComponent {
  readonly title = input<string | undefined>(undefined);
  readonly visible = input(false);
  readonly width = input('32rem');
  readonly modal = input(true);
  readonly showFooter = input(true);

  readonly visibleChange = output<boolean>();
  readonly hidden = output<void>();
}
