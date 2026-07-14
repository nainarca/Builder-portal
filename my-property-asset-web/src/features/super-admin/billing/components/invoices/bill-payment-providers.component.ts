import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PAYMENT_PROVIDERS } from '../../config/billing.config';

@Component({
  selector: 'app-bill-payment-providers',
  template: `
    <section class="bill-payment-providers" aria-label="Payment providers">
      <header class="bill-payment-providers__header">
        <h2 class="bill-payment-providers__title">Payment providers</h2>
        <p class="bill-payment-providers__subtitle">
          Placeholder integrations for checkout and collections.
        </p>
      </header>

      <div class="bill-payment-providers__grid">
        @for (provider of providers; track provider.id) {
          <article class="bill-provider">
            <div class="bill-provider__top">
              <span class="bill-provider__icon" aria-hidden="true">
                <i [class]="provider.icon"></i>
              </span>
              <span
                class="bill-provider__pill"
                [class.bill-provider__pill--planned]="provider.status === 'planned'"
                [class.bill-provider__pill--coming_soon]="provider.status === 'coming_soon'"
                [class.bill-provider__pill--enterprise_only]="provider.status === 'enterprise_only'"
              >
                {{ statusLabel(provider.status) }}
              </span>
            </div>
            <h3 class="bill-provider__name">{{ provider.name }}</h3>
            <p class="bill-provider__desc">{{ provider.description }}</p>
          </article>
        }
      </div>

      <div class="bill-payment-providers__coming">
        @for (card of comingSoon; track card.title) {
          <article class="bill-coming-soon">
            <span class="bill-coming-soon__pill">Coming soon</span>
            <h3 class="bill-coming-soon__title">{{ card.title }}</h3>
            <p class="bill-coming-soon__copy">{{ card.copy }}</p>
          </article>
        }
      </div>
    </section>
  `,
  styles: `
    .bill-payment-providers {
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-md, 1.25rem);
    }

    .bill-payment-providers__title {
      margin: 0 0 0.25rem;
      font-size: var(--mpa-font-size-lg, 1.125rem);
      font-weight: 700;
      color: var(--mpa-color-text);
    }

    .bill-payment-providers__subtitle {
      margin: 0;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text-muted);
    }

    .bill-payment-providers__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
      gap: var(--mpa-spacing-md, 1rem);
    }

    .bill-provider {
      display: flex;
      flex-direction: column;
      gap: 0.55rem;
      padding: var(--mpa-spacing-md, 1.15rem);
      background: var(--mpa-color-surface);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-lg, 0.75rem);
    }

    .bill-provider__top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
    }

    .bill-provider__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.25rem;
      height: 2.25rem;
      border-radius: var(--mpa-radius-md, 0.5rem);
      background: color-mix(in srgb, var(--mpa-color-primary) 12%, transparent);
      color: var(--mpa-color-primary);
    }

    .bill-provider__pill {
      font-size: var(--mpa-font-size-xs, 0.75rem);
      font-weight: 700;
      padding: 0.2rem 0.55rem;
      border-radius: 999px;
      text-transform: capitalize;
    }

    .bill-provider__pill--planned {
      background: color-mix(in srgb, var(--mpa-color-primary) 14%, transparent);
      color: var(--mpa-color-primary);
    }

    .bill-provider__pill--coming_soon {
      background: color-mix(in srgb, var(--mpa-color-warning) 18%, transparent);
      color: var(--mpa-color-warning);
    }

    .bill-provider__pill--enterprise_only {
      background: color-mix(in srgb, var(--mpa-color-text) 10%, transparent);
      color: var(--mpa-color-text);
    }

    .bill-provider__name {
      margin: 0;
      font-size: var(--mpa-font-size-md, 1rem);
      font-weight: 700;
      color: var(--mpa-color-text);
    }

    .bill-provider__desc {
      margin: 0;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text-muted);
      line-height: 1.45;
    }

    .bill-payment-providers__coming {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
      gap: var(--mpa-spacing-md, 1rem);
    }

    .bill-coming-soon {
      display: flex;
      flex-direction: column;
      gap: 0.45rem;
      padding: var(--mpa-spacing-md, 1.15rem);
      border: 1px dashed var(--mpa-color-border);
      border-radius: var(--mpa-radius-lg, 0.75rem);
      background: color-mix(in srgb, var(--mpa-color-background, #f4f6f9) 70%, var(--mpa-color-surface));
    }

    .bill-coming-soon__pill {
      width: fit-content;
      font-size: var(--mpa-font-size-xs, 0.75rem);
      font-weight: 700;
      padding: 0.15rem 0.5rem;
      border-radius: 999px;
      background: color-mix(in srgb, var(--mpa-color-text-muted) 14%, transparent);
      color: var(--mpa-color-text-muted);
    }

    .bill-coming-soon__title {
      margin: 0;
      font-size: var(--mpa-font-size-md, 1rem);
      color: var(--mpa-color-text);
    }

    .bill-coming-soon__copy {
      margin: 0;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text-muted);
      line-height: 1.45;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillPaymentProvidersComponent {
  readonly providers = PAYMENT_PROVIDERS;

  readonly comingSoon = [
    {
      title: 'Coupons',
      copy: 'Percentage and fixed discounts applied at checkout or renewal.',
    },
    {
      title: 'Promo codes',
      copy: 'Campaign codes for trials, upgrades, and partner offers.',
    },
    {
      title: 'Referrals',
      copy: 'Credit builders who refer new organizations onto the platform.',
    },
  ] as const;

  statusLabel(status: string): string {
    return status.replace(/_/g, ' ');
  }
}
