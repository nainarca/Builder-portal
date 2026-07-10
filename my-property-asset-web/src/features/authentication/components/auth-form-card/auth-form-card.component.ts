import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-auth-form-card',
  templateUrl: './auth-form-card.component.html',
  styleUrl: './auth-form-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthFormCardComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string | undefined>(undefined);
  readonly eyebrow = input<string | undefined>(undefined);
}
