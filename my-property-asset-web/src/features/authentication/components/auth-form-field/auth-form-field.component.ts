import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl } from '@angular/forms';

import { InputTextComponent } from '@shared/ui';

@Component({
  selector: 'app-auth-form-field',
  imports: [InputTextComponent],
  templateUrl: './auth-form-field.component.html',
  styleUrl: './auth-form-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthFormFieldComponent {
  readonly control = input.required<FormControl<string>>();
  readonly label = input.required<string>();
  readonly inputId = input.required<string>();
  readonly type = input<'text' | 'email'>('text');
  readonly placeholder = input<string | undefined>(undefined);
  readonly autocomplete = input<string | undefined>(undefined);
  readonly hint = input<string | undefined>(undefined);

  showError(): boolean {
    const control = this.control();
    return control.invalid && (control.dirty || control.touched);
  }

  errorMessage(): string | null {
    const control = this.control();
    if (!this.showError()) {
      return null;
    }

    if (control.hasError('required')) {
      return `${this.label()} is required.`;
    }

    if (control.hasError('email') || control.hasError('pattern')) {
      return 'Enter a valid email address.';
    }

    if (control.hasError('minlength')) {
      const required = control.getError('minlength')?.requiredLength;
      return `Must be at least ${required} characters.`;
    }

    return 'This field is invalid.';
  }
}
