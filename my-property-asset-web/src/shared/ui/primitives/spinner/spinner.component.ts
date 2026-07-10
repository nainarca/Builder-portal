import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-spinner',
  imports: [ProgressSpinner],
  template: `
    <p-progressSpinner
      [style]="{ width: diameter(), height: diameter() }"
      [strokeWidth]="strokeWidth()"
      [ariaLabel]="ariaLabel()"
    />
  `,
  styleUrl: './spinner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ui-spinner',
    '[class.ui-spinner--overlay]': 'overlay()',
    role: 'status',
    '[attr.aria-live]': "'polite'",
  },
})
export class SpinnerComponent {
  readonly diameter = input('2.5rem');
  readonly strokeWidth = input('3');
  readonly overlay = input(false);
  readonly ariaLabel = input('Loading');
}
