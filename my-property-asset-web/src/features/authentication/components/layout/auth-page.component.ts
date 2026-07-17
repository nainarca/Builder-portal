import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Authentication page frame — consistent spacing inside the public auth layout.
 * Feature-local chrome; composes enterprise design tokens only.
 */
@Component({
  selector: 'app-auth-page',
  template: `<div class="auth-page"><ng-content /></div>`,
  styles: `
    .auth-page {
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-lg);
      width: 100%;
      animation: ui-fade-in var(--mpa-transition-normal) ease;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthPageComponent {}
