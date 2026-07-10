import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'app-dialog',
  imports: [Dialog],
  template: `
    <p-dialog
      [header]="header()"
      [visible]="visible()"
      [modal]="modal()"
      [closable]="closable()"
      [draggable]="draggable()"
      [resizable]="resizable()"
      [style]="dialogStyle()"
      [breakpoints]="breakpoints()"
      [appendTo]="appendTo()"
      [focusTrap]="focusTrap()"
      (visibleChange)="visibleChange.emit($event)"
      (onHide)="hidden.emit()"
    >
      <ng-content />
    </p-dialog>
  `,
  styleUrl: './dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent {
  readonly header = input<string | undefined>(undefined);
  readonly visible = input(false);
  readonly modal = input(true);
  readonly closable = input(true);
  readonly draggable = input(false);
  readonly resizable = input(false);
  readonly appendTo = input<string | HTMLElement>('body');
  readonly focusTrap = input(true);
  readonly width = input('32rem');
  readonly breakpoints = input<Record<string, string>>({
    '960px': '90vw',
    '640px': '95vw',
  });

  readonly visibleChange = output<boolean>();
  readonly hidden = output<void>();

  dialogStyle(): Record<string, string> {
    return { width: this.width() };
  }
}
