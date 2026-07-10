import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { ChipComponent } from '../../primitives/chip/chip.component';

@Component({
  selector: 'app-chip-wrapper',
  imports: [ChipComponent],
  template: `<app-chip [label]="label()" [icon]="icon()" [removable]="removable()" (removed)="removed.emit($event)" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipWrapperComponent {
  readonly label = input<string | undefined>(undefined);
  readonly icon = input<string | undefined>(undefined);
  readonly removable = input(false);

  readonly removed = output<MouseEvent>();
}
