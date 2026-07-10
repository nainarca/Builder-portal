import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth-remember-me',
  imports: [ReactiveFormsModule],
  template: `
    <label class="auth-remember-me">
      <input
        type="checkbox"
        class="auth-remember-me__input"
        [formControl]="control()"
      />
      <span class="auth-remember-me__label">{{ label() }}</span>
    </label>
  `,
  styleUrl: './auth-remember-me.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthRememberMeComponent {
  readonly control = input.required<FormControl<boolean>>();
  readonly label = input('Remember me on this device');
}
