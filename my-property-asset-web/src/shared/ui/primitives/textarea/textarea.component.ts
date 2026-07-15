import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Textarea } from 'primeng/textarea';

@Component({
  selector: 'app-textarea',
  imports: [FormsModule, Textarea],
  template: `
    <textarea
      pTextarea
      [rows]="rows()"
      [placeholder]="placeholder()"
      [disabled]="disabled()"
      [readonly]="readonly()"
      [attr.id]="inputId()"
      [attr.name]="name()"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-invalid]="invalid() ? 'true' : null"
      [ngModel]="value()"
      (ngModelChange)="valueChange.emit($event)"
    ></textarea>
  `,
  styleUrl: './textarea.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaComponent {
  readonly value = input<string>('');
  readonly rows = input(3);
  readonly placeholder = input<string | undefined>(undefined);
  readonly disabled = input(false);
  readonly readonly = input(false);
  readonly invalid = input(false);
  readonly inputId = input<string | undefined>(undefined);
  readonly name = input<string | undefined>(undefined);
  readonly ariaLabel = input<string | undefined>(undefined);

  readonly valueChange = output<string>();
}
