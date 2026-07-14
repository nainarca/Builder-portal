import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { BillingAdminStoreService } from '../../services/billing-admin-store.service';
import { BillLicenseCardComponent } from '../shared/bill-license-card.component';

@Component({
  selector: 'app-bill-license-overview',
  imports: [BillLicenseCardComponent],
  template: `
    <section class="bill-license-overview" aria-label="License overview">
      <header class="bill-license-overview__header">
        <div>
          <h2 class="bill-license-overview__title">Licenses</h2>
          <p class="bill-license-overview__subtitle">Seat pools across builder organizations.</p>
        </div>
      </header>

      <div class="bill-license-overview__summary">
        <article class="bill-license-summary">
          <span class="bill-license-summary__label">Allocated</span>
          <span class="bill-license-summary__value">{{ totals().allocated }}</span>
        </article>
        <article class="bill-license-summary">
          <span class="bill-license-summary__label">Used</span>
          <span class="bill-license-summary__value">{{ totals().used }}</span>
        </article>
        <article class="bill-license-summary">
          <span class="bill-license-summary__label">Available</span>
          <span class="bill-license-summary__value">{{ totals().available }}</span>
        </article>
        <article class="bill-license-summary bill-license-summary--util">
          <span class="bill-license-summary__label">Utilization</span>
          <span class="bill-license-summary__value">{{ totals().utilization }}%</span>
        </article>
      </div>

      <div class="bill-license-overview__grid">
        @for (license of store.licenses(); track license.id) {
          <app-bill-license-card [license]="license" />
        } @empty {
          <p class="bill-license-overview__empty">No license pools configured.</p>
        }
      </div>
    </section>
  `,
  styles: `
    .bill-license-overview {
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-md, 1.25rem);
    }

    .bill-license-overview__title {
      margin: 0 0 0.25rem;
      font-size: var(--mpa-font-size-lg, 1.125rem);
      font-weight: 700;
      color: var(--mpa-color-text);
    }

    .bill-license-overview__subtitle {
      margin: 0;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text-muted);
    }

    .bill-license-overview__summary {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(9.5rem, 1fr));
      gap: var(--mpa-spacing-sm, 0.75rem);
    }

    .bill-license-summary {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      padding: var(--mpa-spacing-md, 1rem);
      background: var(--mpa-color-surface);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-md, 0.5rem);
    }

    .bill-license-summary--util {
      background: linear-gradient(
        145deg,
        color-mix(in srgb, var(--mpa-color-primary) 8%, var(--mpa-color-surface)),
        var(--mpa-color-surface)
      );
    }

    .bill-license-summary__label {
      font-size: var(--mpa-font-size-xs, 0.75rem);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      color: var(--mpa-color-text-muted);
    }

    .bill-license-summary__value {
      font-size: var(--mpa-font-size-xl, 1.5rem);
      font-weight: 700;
      color: var(--mpa-color-text);
    }

    .bill-license-overview__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
      gap: var(--mpa-spacing-md, 1rem);
    }

    .bill-license-overview__empty {
      margin: 0;
      padding: var(--mpa-spacing-md, 1.25rem);
      color: var(--mpa-color-text-muted);
      border: 1px dashed var(--mpa-color-border);
      border-radius: var(--mpa-radius-md, 0.5rem);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillLicenseOverviewComponent {
  readonly store = inject(BillingAdminStoreService);

  readonly totals = computed(() => {
    const licenses = this.store.licenses();
    const allocated = licenses.reduce((sum, l) => sum + l.allocated, 0);
    const used = licenses.reduce((sum, l) => sum + l.used, 0);
    const available = licenses.reduce((sum, l) => sum + l.available, 0);
    return {
      allocated,
      used,
      available,
      utilization: allocated ? Math.round((used / allocated) * 100) : 0,
    };
  });
}
