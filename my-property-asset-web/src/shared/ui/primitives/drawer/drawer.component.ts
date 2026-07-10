import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Drawer } from 'primeng/drawer';

@Component({
  selector: 'app-drawer',
  imports: [Drawer],
  template: `
    <p-drawer
      [header]="header()"
      [visible]="visible()"
      [position]="position()"
      [modal]="modal()"
      [dismissible]="dismissible()"
      [closable]="closable()"
      [style]="drawerStyle()"
      (visibleChange)="visibleChange.emit($event)"
      (onHide)="hidden.emit()"
    >
      <ng-content />
    </p-drawer>
  `,
  styleUrl: './drawer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerComponent {
  readonly header = input<string | undefined>(undefined);
  readonly visible = input(false);
  readonly position = input<'left' | 'right' | 'top' | 'bottom'>('right');
  readonly modal = input(true);
  readonly dismissible = input(true);
  readonly closable = input(true);
  readonly size = input('24rem');

  readonly visibleChange = output<boolean>();
  readonly hidden = output<void>();

  drawerStyle(): Record<string, string> {
    const position = this.position();
    if (position === 'top' || position === 'bottom') {
      return { height: this.size() };
    }

    return { width: this.size() };
  }
}
