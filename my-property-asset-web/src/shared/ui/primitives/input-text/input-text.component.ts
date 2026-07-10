import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';

@Component({
  selector: 'app-input-text',
  imports: [FormsModule, InputText],
  template: `
    <input
      pInputText
      [type]="type()"
      [placeholder]="placeholder()"
      [disabled]="disabled()"
      [readonly]="readonly()"
      [attr.id]="inputId()"
      [attr.name]="name()"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-invalid]="invalid() ? 'true' : null"
      [attr.autocomplete]="autocomplete()"
      [ngModel]="value()"
      (ngModelChange)="valueChange.emit($event)"
    />
  `,
  styleUrl: './input-text.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputTextComponent {
  readonly value = input<string>('');
  readonly type = input<'text' | 'email' | 'search' | 'password' | 'url'>('text');
  readonly placeholder = input<string | undefined>(undefined);
  readonly disabled = input(false);
  readonly readonly = input(false);
  readonly invalid = input(false);
  readonly inputId = input<string | undefined>(undefined);
  readonly name = input<string | undefined>(undefined);
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly autocomplete = input<string | undefined>(undefined);

  readonly valueChange = output<string>();
}
