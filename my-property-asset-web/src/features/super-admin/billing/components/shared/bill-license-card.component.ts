import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { LicensePool } from '../../models/billing-admin.model';
import { BillPaymentStatusBadgeComponent } from './bill-payment-status-badge.component';

@Component({
  selector: 'app-bill-license-card',
  imports: [BillPaymentStatusBadgeComponent],
  template: `
    <article class="bill-license-card">
      <header class="bill-license-card__header">
        <div>
          <h3 class="bill-license-card__org">{{ license().organizationName }}</h3>
          <p class="bill-license-card__product">{{ license().product }}</p>
        </div>
        <app-bill-payment-status-badge [status]="license().status" />
      </header>

      <dl class="bill-license-card__stats">
        <div class="bill-license-card__stat">
          <dt>Allocated</dt>
          <dd>{{ license().allocated }}</dd>
        </div>
        <div class="bill-license-card__stat">
          <dt>Used</dt>
          <dd>{{ license().used }}</dd>
        </div>
        <div class="bill-license-card__stat">
          <dt>Available</dt>
          <dd>{{ license().available }}</dd>
        </div>
      </dl>

      <footer class="bill-license-card__footer">
        <span class="bill-license-card__expiry-label">Expires</span>
        <time [attr.datetime]="license().expiresAt">{{ formatDate(license().expiresAt) }}</time>
      </footer>
    </article>
  `,
  styles: `
    .bill-license-card {
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-md, 1rem);
      padding: var(--mpa-spacing-md, 1.15rem);
      background: var(--mpa-color-surface);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-lg, 0.75rem);
    }

    .bill-license-card__header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 0.75rem;
    }

    .bill-license-card__org {
      margin: 0 0 0.2rem;
      font-size: var(--mpa-font-size-md, 1rem);
      font-weight: 700;
      color: var(--mpa-color-text);
    }

    .bill-license-card__product {
      margin: 0;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text-muted);
    }

    .bill-license-card__stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.5rem;
      margin: 0;
    }

    .bill-license-card__stat {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
      padding: 0.55rem 0.65rem;
      background: color-mix(
        in srgb,
        var(--mpa-color-background, transparent) 60%,
        var(--mpa-color-surface)
      );
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-sm, 0.375rem);
    }

    .bill-license-card__stat dt {
      margin: 0;
      font-size: var(--mpa-font-size-xs, 0.75rem);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      color: var(--mpa-color-text-muted);
    }

    .bill-license-card__stat dd {
      margin: 0;
      font-size: var(--mpa-font-size-md, 1rem);
      font-weight: 700;
      color: var(--mpa-color-text);
    }

    .bill-license-card__footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.5rem;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text);
      padding-top: 0.35rem;
      border-top: 1px solid var(--mpa-color-border);
    }

    .bill-license-card__expiry-label {
      color: var(--mpa-color-text-muted);
      font-weight: 500;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillLicenseCardComponent {
  readonly license = input.required<LicensePool>();

  formatDate(iso: string): string {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(iso));
  }
}
