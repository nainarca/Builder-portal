import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { BillingAdminStoreService } from '../../services/billing-admin-store.service';
import { BillUsageMeterComponent } from '../shared/bill-usage-meter.component';

@Component({
  selector: 'app-bill-usage-dashboard',
  imports: [BillUsageMeterComponent],
  template: `
    <section class="bill-usage-dashboard" aria-label="Usage dashboard">
      <header class="bill-usage-dashboard__header">
        <div>
          <h2 class="bill-usage-dashboard__title">Usage</h2>
          <p class="bill-usage-dashboard__subtitle">
            Consumption against plan limits across the commercial estate.
          </p>
        </div>
      </header>

      <div class="bill-usage-dashboard__meters">
        @for (metric of store.usage(); track metric.key) {
          <app-bill-usage-meter [metric]="metric" />
        }
      </div>

      <aside class="bill-usage-dashboard__note" role="note">
        <i class="pi pi-info-circle" aria-hidden="true"></i>
        <div>
          <strong>Feature limits</strong>
          <p>
            Soft caps shown here reflect the aggregate Growth/Business entitlements in the mock
            catalog. Metrics marked as placeholders are not yet wired to live product telemetry and
            should not drive billing decisions until instrumentation is complete.
          </p>
        </div>
      </aside>
    </section>
  `,
  styles: `
    .bill-usage-dashboard {
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-md, 1.25rem);
    }

    .bill-usage-dashboard__title {
      margin: 0 0 0.25rem;
      font-size: var(--mpa-font-size-lg, 1.125rem);
      font-weight: 700;
      color: var(--mpa-color-text);
    }

    .bill-usage-dashboard__subtitle {
      margin: 0;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text-muted);
    }

    .bill-usage-dashboard__meters {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
      gap: var(--mpa-spacing-md, 1rem);
    }

    .bill-usage-dashboard__note {
      display: flex;
      gap: 0.75rem;
      padding: var(--mpa-spacing-md, 1.15rem);
      background: color-mix(in srgb, var(--mpa-color-primary) 6%, var(--mpa-color-surface));
      border: 1px solid color-mix(in srgb, var(--mpa-color-primary) 22%, var(--mpa-color-border));
      border-radius: var(--mpa-radius-md, 0.5rem);
      color: var(--mpa-color-text);
    }

    .bill-usage-dashboard__note > i {
      margin-top: 0.15rem;
      color: var(--mpa-color-primary);
      flex: none;
    }

    .bill-usage-dashboard__note strong {
      display: block;
      margin-bottom: 0.25rem;
      font-size: var(--mpa-font-size-sm, 0.875rem);
    }

    .bill-usage-dashboard__note p {
      margin: 0;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      line-height: 1.5;
      color: var(--mpa-color-text-muted);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillUsageDashboardComponent {
  readonly store = inject(BillingAdminStoreService);
}
