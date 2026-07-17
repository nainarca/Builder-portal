import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-auth-trust-footer',
  template: `
    <footer class="auth-trust-footer" aria-label="Security and trust indicators">
      <ul class="auth-trust-footer__list">
        <li><i class="pi pi-shield" aria-hidden="true"></i> Enterprise-grade security</li>
        <li><i class="pi pi-lock" aria-hidden="true"></i> Encrypted sessions</li>
        <li><i class="pi pi-verified" aria-hidden="true"></i> White-label ready</li>
      </ul>
    </footer>
  `,
  styles: `
    .auth-trust-footer {
      margin-top: var(--mpa-spacing-lg);
      padding-top: var(--mpa-spacing-md);
      border-top: 1px solid var(--mpa-color-border);
    }

    .auth-trust-footer__list {
      display: flex;
      flex-wrap: wrap;
      gap: var(--mpa-spacing-sm) var(--mpa-spacing-md);
      margin: 0;
      padding: 0;
      list-style: none;
      font-size: var(--mpa-font-size-xs);
      color: var(--mpa-color-text-muted);
    }

    .auth-trust-footer__list li {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
    }

    .auth-trust-footer__list i {
      font-size: 0.75rem;
      color: var(--mpa-color-primary);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthTrustFooterComponent {}
