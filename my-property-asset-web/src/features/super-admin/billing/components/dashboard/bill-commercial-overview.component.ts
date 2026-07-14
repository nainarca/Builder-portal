import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { formatRupees } from '../../config/billing.config';
import { BillingAdminStoreService } from '../../services/billing-admin-store.service';

@Component({
  selector: 'app-bill-commercial-overview',
  template: `
    <section class="bill-overview" aria-label="Commercial overview">
      <header class="bill-overview__header">
        <h2 class="bill-overview__title">Commercial overview</h2>
        <p class="bill-overview__subtitle">Live subscription health across builder organizations.</p>
      </header>

      <div class="bill-overview__grid">
        @for (card of cards(); track card.key) {
          <article
            class="bill-stat"
            [class.bill-stat--danger]="card.tone === 'danger'"
            [class.bill-stat--warning]="card.tone === 'warning'"
            [class.bill-stat--success]="card.tone === 'success'"
          >
            <div class="bill-stat__icon" aria-hidden="true">
              <i [class]="card.icon"></i>
            </div>
            <div class="bill-stat__body">
              <span class="bill-stat__label">{{ card.label }}</span>
              <span class="bill-stat__value">{{ card.value }}</span>
              @if (card.hint) {
                <span class="bill-stat__hint">{{ card.hint }}</span>
              }
            </div>
          </article>
        }
      </div>
    </section>
  `,
  styles: `
    .bill-overview {
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-md, 1.25rem);
    }

    .bill-overview__header {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .bill-overview__title {
      margin: 0;
      font-size: var(--mpa-font-size-lg, 1.125rem);
      font-weight: 700;
      color: var(--mpa-color-text);
    }

    .bill-overview__subtitle {
      margin: 0;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text-muted);
    }

    .bill-overview__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(11.5rem, 1fr));
      gap: var(--mpa-spacing-md, 1rem);
    }

    .bill-stat {
      display: flex;
      gap: 0.85rem;
      padding: var(--mpa-spacing-md, 1.15rem);
      background:
        linear-gradient(
          145deg,
          color-mix(in srgb, var(--mpa-color-primary) 6%, var(--mpa-color-surface)),
          var(--mpa-color-surface)
        );
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-lg, 0.75rem);
      box-shadow: 0 1px 0 color-mix(in srgb, var(--mpa-color-text) 4%, transparent);
    }

    .bill-stat--danger {
      background: linear-gradient(
        145deg,
        color-mix(in srgb, var(--mpa-color-danger) 8%, var(--mpa-color-surface)),
        var(--mpa-color-surface)
      );
    }

    .bill-stat--warning {
      background: linear-gradient(
        145deg,
        color-mix(in srgb, var(--mpa-color-warning) 10%, var(--mpa-color-surface)),
        var(--mpa-color-surface)
      );
    }

    .bill-stat--success {
      background: linear-gradient(
        145deg,
        color-mix(in srgb, var(--mpa-color-success) 8%, var(--mpa-color-surface)),
        var(--mpa-color-surface)
      );
    }

    .bill-stat__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      flex: none;
      border-radius: var(--mpa-radius-md, 0.5rem);
      background: color-mix(in srgb, var(--mpa-color-primary) 12%, transparent);
      color: var(--mpa-color-primary);
      font-size: 1.1rem;
    }

    .bill-stat--danger .bill-stat__icon {
      background: color-mix(in srgb, var(--mpa-color-danger) 14%, transparent);
      color: var(--mpa-color-danger);
    }

    .bill-stat--warning .bill-stat__icon {
      background: color-mix(in srgb, var(--mpa-color-warning) 16%, transparent);
      color: var(--mpa-color-warning);
    }

    .bill-stat--success .bill-stat__icon {
      background: color-mix(in srgb, var(--mpa-color-success) 14%, transparent);
      color: var(--mpa-color-success);
    }

    .bill-stat__body {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
      min-width: 0;
    }

    .bill-stat__label {
      font-size: var(--mpa-font-size-xs, 0.75rem);
      font-weight: 600;
      letter-spacing: 0.02em;
      text-transform: uppercase;
      color: var(--mpa-color-text-muted);
    }

    .bill-stat__value {
      font-size: var(--mpa-font-size-xl, 1.5rem);
      font-weight: 700;
      line-height: 1.2;
      color: var(--mpa-color-text);
    }

    .bill-stat__hint {
      font-size: var(--mpa-font-size-xs, 0.75rem);
      color: var(--mpa-color-text-muted);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillCommercialOverviewComponent {
  private readonly store = inject(BillingAdminStoreService);

  readonly cards = computed(() => {
    const o = this.store.overview();
    return [
      {
        key: 'active',
        label: 'Active',
        value: String(o.activeSubscriptions),
        hint: 'Paying & healthy',
        icon: 'pi pi-check-circle',
        tone: 'success',
      },
      {
        key: 'trial',
        label: 'Trials',
        value: String(o.trialCount),
        hint: 'Conversion window',
        icon: 'pi pi-clock',
        tone: 'warning',
      },
      {
        key: 'pastDue',
        label: 'Past due',
        value: String(o.pastDueCount),
        hint: 'Needs collection',
        icon: 'pi pi-exclamation-triangle',
        tone: o.pastDueCount > 0 ? 'danger' : 'default',
      },
      {
        key: 'mrr',
        label: 'MRR',
        value: formatRupees(o.mrr),
        hint: 'Normalized monthly',
        icon: 'pi pi-chart-line',
        tone: 'default',
      },
      {
        key: 'license',
        label: 'License use',
        value: `${o.licenseUtilization}%`,
        hint: 'Across all pools',
        icon: 'pi pi-key',
        tone: o.licenseUtilization >= 90 ? 'danger' : o.licenseUtilization >= 75 ? 'warning' : 'default',
      },
      {
        key: 'renewals',
        label: 'Renewals',
        value: String(o.upcomingRenewals),
        hint: 'Active & trial',
        icon: 'pi pi-sync',
        tone: 'default',
      },
    ] as const;
  });
}
