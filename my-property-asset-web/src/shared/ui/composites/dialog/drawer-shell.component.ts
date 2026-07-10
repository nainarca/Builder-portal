import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { DrawerComponent } from '../../primitives/drawer/drawer.component';

@Component({
  selector: 'app-drawer-shell',
  imports: [DrawerComponent],
  template: `
    <app-drawer
      [header]="title()"
      [visible]="visible()"
      [position]="position()"
      [size]="size()"
      [modal]="modal()"
      [dismissible]="dismissible()"
      (visibleChange)="visibleChange.emit($event)"
      (hidden)="hidden.emit()"
    >
      <ng-content />
    </app-drawer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerShellComponent {
  readonly title = input<string | undefined>(undefined);
  readonly visible = input(false);
  readonly position = input<'left' | 'right' | 'top' | 'bottom'>('right');
  readonly size = input('24rem');
  readonly modal = input(true);
  readonly dismissible = input(true);

  readonly visibleChange = output<boolean>();
  readonly hidden = output<void>();
}
