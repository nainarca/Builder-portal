import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { ButtonComponent } from '../../../../shared/ui';

@Component({
  selector: 'app-friendly-error',
  imports: [ButtonComponent],
  template: `
    <div class="platform-friendly-error">
      <h3 class="platform-friendly-error__title">{{ title() }}</h3>
      <p class="platform-friendly-error__message">{{ message() }}</p>
      @if (actionLabel()) {
        <app-button [label]="actionLabel()!" (clicked)="action.emit()" />
      }
    </div>
  `,
  styles: `
    .platform-friendly-error {
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-md);
      padding: var(--mpa-spacing-xl);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-xl);
      background: var(--mpa-color-surface-elevated);
      box-shadow: var(--mpa-shadow-sm);
      text-align: center;
    }

    .platform-friendly-error__title {
      margin: 0;
      font-size: var(--mpa-font-size-lg);
      font-weight: var(--mpa-font-weight-semibold);
      color: var(--mpa-color-text);
    }

    .platform-friendly-error__message {
      margin: 0;
      color: var(--mpa-color-text-muted);
      line-height: var(--mpa-line-height-relaxed);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FriendlyErrorComponent {
  readonly title = input('Something went wrong');
  readonly message = input('Please try again or contact support if the problem continues.');
  readonly actionLabel = input<string | undefined>('Try again');

  readonly action = output<void>();
}
