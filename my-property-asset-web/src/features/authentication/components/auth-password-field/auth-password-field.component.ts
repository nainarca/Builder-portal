import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { FormControl } from '@angular/forms';

import { ButtonComponent, InputTextComponent } from '@shared/ui';

@Component({
  selector: 'app-auth-password-field',
  imports: [InputTextComponent, ButtonComponent],
  templateUrl: './auth-password-field.component.html',
  styleUrl: './auth-password-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthPasswordFieldComponent {
  readonly control = input.required<FormControl<string>>();
  readonly label = input('Password');
  readonly inputId = input('password');
  readonly placeholder = input('Enter your password');
  readonly autocomplete = input('current-password');

  readonly visible = signal(false);

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
      return 'Password is required.';
    }

    if (control.hasError('minlength')) {
      const required = control.getError('minlength')?.requiredLength;
      return `Password must be at least ${required} characters.`;
    }

    return 'Password is invalid.';
  }

  toggleVisibility(): void {
    this.visible.update((value) => !value);
  }
}
