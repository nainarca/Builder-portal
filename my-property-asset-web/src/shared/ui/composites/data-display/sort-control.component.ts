import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { ButtonComponent } from '../../primitives/button/button.component';

export interface SortOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-sort-control',
  imports: [ButtonComponent],
  template: `
    <div class="ui-sort-control" role="group" [attr.aria-label]="ariaLabel()">
      @for (option of options(); track option.value) {
        <app-button
          [label]="option.label"
          [outlined]="value() !== option.value"
          [text]="value() !== option.value"
          size="small"
          (clicked)="sortChange.emit(option.value)"
        />
      }
    </div>
  `,
  styles: `
    .ui-sort-control {
      display: inline-flex;
      flex-wrap: wrap;
      gap: var(--mpa-spacing-xs);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SortControlComponent {
  readonly options = input<readonly SortOption[]>([]);
  readonly value = input<string | null>(null);
  readonly ariaLabel = input('Sort');

  readonly sortChange = output<string>();
}
