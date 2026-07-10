import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Chip } from 'primeng/chip';

@Component({
  selector: 'app-chip',
  imports: [Chip],
  template: `
    <p-chip
      [label]="label()"
      [icon]="icon()"
      [removable]="removable()"
      (onRemove)="removed.emit($event)"
    />
  `,
  styleUrl: './chip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipComponent {
  readonly label = input<string | undefined>(undefined);
  readonly icon = input<string | undefined>(undefined);
  readonly removable = input(false);

  readonly removed = output<MouseEvent>();
}
