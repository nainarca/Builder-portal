import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';

export interface SelectOption {
  readonly label: string;
  readonly value: string;
}

@Component({
  selector: 'app-select',
  imports: [FormsModule, Select],
  template: `
    <p-select
      [options]="mutableOptions()"
      optionLabel="label"
      optionValue="value"
      [placeholder]="placeholder()"
      [disabled]="disabled()"
      [attr.aria-label]="ariaLabel()"
      [ngModel]="value()"
      (ngModelChange)="valueChange.emit($event)"
    />
  `,
  styleUrl: './select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent {
  readonly options = input.required<readonly SelectOption[]>();

  readonly mutableOptions = computed(() => [...this.options()]);
  readonly value = input<string | undefined>(undefined);
  readonly placeholder = input<string | undefined>(undefined);
  readonly disabled = input(false);
  readonly ariaLabel = input<string | undefined>(undefined);

  readonly valueChange = output<string>();
}
