import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { SplitButton } from 'primeng/splitbutton';

/**
 * DS-03 Split Button — primary action + overflow menu (PrimeNG compatible).
 */
@Component({
  selector: 'app-split-button',
  imports: [SplitButton],
  template: `
    <p-splitbutton
      [label]="label()"
      [icon]="icon()"
      [model]="items()"
      [disabled]="disabled()"
      [severity]="severity()"
      [outlined]="outlined()"
      [text]="text()"
      [size]="size()"
      [attr.aria-label]="ariaLabel()"
      (onClick)="clicked.emit($event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'enterprise-split-button' },
})
export class SplitButtonComponent {
  readonly label = input.required<string>();
  readonly icon = input<string | undefined>(undefined);
  readonly items = input<MenuItem[]>([]);
  readonly disabled = input(false);
  readonly severity = input<
    'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'help' | 'contrast'
  >('primary');
  readonly outlined = input(false);
  readonly text = input(false);
  readonly size = input<'small' | 'large' | undefined>(undefined);
  readonly ariaLabel = input<string | undefined>(undefined);

  readonly clicked = output<MouseEvent>();
}
