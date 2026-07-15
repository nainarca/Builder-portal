import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Checkbox } from 'primeng/checkbox';

let checkboxCounter = 0;

@Component({
  selector: 'app-checkbox',
  imports: [FormsModule, Checkbox],
  template: `
    <span class="ui-checkbox">
      <p-checkbox
        [inputId]="generatedId"
        [binary]="true"
        [disabled]="disabled()"
        [attr.aria-label]="ariaLabel()"
        [ngModel]="checked()"
        (ngModelChange)="checkedChange.emit($event)"
      />
      @if (label()) {
        <label [for]="generatedId" class="ui-checkbox__label">{{ label() }}</label>
      }
    </span>
  `,
  styleUrl: './checkbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxComponent {
  readonly generatedId = `app-checkbox-${++checkboxCounter}`;

  readonly checked = input(false);
  readonly label = input<string | undefined>(undefined);
  readonly disabled = input(false);
  readonly ariaLabel = input<string | undefined>(undefined);

  readonly checkedChange = output<boolean>();
}
