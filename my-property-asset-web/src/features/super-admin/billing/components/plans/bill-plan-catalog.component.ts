import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { formatRupees } from '../../config/billing.config';
import { BillingInterval, PlanFeature, SubscriptionPlan } from '../../models/billing-admin.model';
import { BillingAdminStoreService } from '../../services/billing-admin-store.service';
import { BillingViewStateService } from '../../services/billing-view-state.service';
import { BillPlanCardComponent } from '../shared/bill-plan-card.component';

@Component({
  selector: 'app-bill-plan-catalog',
  imports: [BillPlanCardComponent],
  template: `
    <section class="bill-plan-catalog" aria-label="Plan catalog">
      <header class="bill-plan-catalog__header">
        <div>
          <h2 class="bill-plan-catalog__title">Plans</h2>
          <p class="bill-plan-catalog__subtitle">Compare tiers and billing intervals.</p>
        </div>
        <div class="bill-plan-catalog__toggle" role="group" aria-label="Billing interval">
          <button
            type="button"
            class="bill-plan-catalog__chip"
            [class.bill-plan-catalog__chip--active]="interval() === 'monthly'"
            (click)="setInterval('monthly')"
          >
            Monthly
          </button>
          <button
            type="button"
            class="bill-plan-catalog__chip"
            [class.bill-plan-catalog__chip--active]="interval() === 'annual'"
            (click)="setInterval('annual')"
          >
            Annual
          </button>
        </div>
      </header>

      <div class="bill-plan-catalog__grid">
        @for (plan of store.plans(); track plan.id) {
          <app-bill-plan-card
            [plan]="plan"
            [interval]="interval()"
            [selected]="isCompareSelected(plan.id)"
            (selectPlan)="onSelectPlan($event)"
            (toggleCompare)="onToggleCompare($event)"
          />
        }
      </div>

      @if (comparePlans().length) {
        <section class="bill-compare" aria-label="Plan comparison">
          <header class="bill-compare__header">
            <h3 class="bill-compare__title">Compare selected plans</h3>
            <p class="bill-compare__subtitle">Feature checklist across {{ comparePlans().length }} plans.</p>
          </header>

          <div class="bill-compare__table-wrap">
            <table class="bill-compare__table">
              <thead>
                <tr>
                  <th scope="col">Feature</th>
                  @for (plan of comparePlans(); track plan.id) {
                    <th scope="col">
                      <span class="bill-compare__plan-name">{{ plan.name }}</span>
                      <span class="bill-compare__plan-price">{{ priceLabel(plan) }}</span>
                    </th>
                  }
                </tr>
              </thead>
              <tbody>
                @for (row of compareRows(); track row.id) {
                  <tr>
                    <th scope="row">{{ row.label }}</th>
                    @for (cell of row.cells; track $index) {
                      <td>
                        @if (cell.included) {
                          <i class="pi pi-check bill-compare__yes" aria-label="Included"></i>
                        } @else {
                          <i class="pi pi-minus bill-compare__no" aria-label="Not included"></i>
                        }
                      </td>
                    }
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </section>
      }
    </section>
  `,
  styles: `
    .bill-plan-catalog {
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-lg, 1.5rem);
    }

    .bill-plan-catalog__header {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-end;
      justify-content: space-between;
      gap: 1rem;
    }

    .bill-plan-catalog__title {
      margin: 0 0 0.25rem;
      font-size: var(--mpa-font-size-lg, 1.125rem);
      font-weight: 700;
      color: var(--mpa-color-text);
    }

    .bill-plan-catalog__subtitle {
      margin: 0;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text-muted);
    }

    .bill-plan-catalog__toggle {
      display: inline-flex;
      padding: 0.2rem;
      background: var(--mpa-color-surface);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-md, 0.5rem);
    }

    .bill-plan-catalog__chip {
      border: 0;
      background: transparent;
      color: var(--mpa-color-text-muted);
      font: inherit;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      font-weight: 600;
      padding: 0.45rem 0.9rem;
      border-radius: var(--mpa-radius-sm, 0.375rem);
      cursor: pointer;
    }

    .bill-plan-catalog__chip--active {
      background: color-mix(in srgb, var(--mpa-color-primary) 14%, transparent);
      color: var(--mpa-color-primary);
    }

    .bill-plan-catalog__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
      gap: var(--mpa-spacing-md, 1rem);
    }

    .bill-compare {
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-md, 1rem);
      padding: var(--mpa-spacing-md, 1.25rem);
      background: var(--mpa-color-surface);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-lg, 0.75rem);
    }

    .bill-compare__title {
      margin: 0 0 0.25rem;
      font-size: var(--mpa-font-size-md, 1rem);
      font-weight: 700;
      color: var(--mpa-color-text);
    }

    .bill-compare__subtitle {
      margin: 0;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text-muted);
    }

    .bill-compare__table-wrap {
      overflow-x: auto;
    }

    .bill-compare__table {
      width: 100%;
      border-collapse: collapse;
      min-width: 28rem;
    }

    .bill-compare__table th,
    .bill-compare__table td {
      padding: 0.75rem 0.85rem;
      border-bottom: 1px solid var(--mpa-color-border);
      text-align: center;
      vertical-align: middle;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text);
    }

    .bill-compare__table th[scope='row'] {
      text-align: left;
      font-weight: 600;
      color: var(--mpa-color-text);
    }

    .bill-compare__table thead th {
      vertical-align: bottom;
    }

    .bill-compare__plan-name {
      display: block;
      font-weight: 700;
    }

    .bill-compare__plan-price {
      display: block;
      margin-top: 0.2rem;
      font-size: var(--mpa-font-size-xs, 0.75rem);
      font-weight: 500;
      color: var(--mpa-color-text-muted);
    }

    .bill-compare__yes {
      color: var(--mpa-color-success);
    }

    .bill-compare__no {
      color: var(--mpa-color-text-muted);
      opacity: 0.55;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillPlanCatalogComponent {
  readonly store = inject(BillingAdminStoreService);
  private readonly viewState = inject(BillingViewStateService);

  readonly interval = this.viewState.billingInterval;

  readonly comparePlans = computed(() => {
    const ids = this.viewState.comparePlanIds();
    return this.store.plans().filter((p) => ids.includes(p.id));
  });

  readonly compareRows = computed(() => {
    const plans = this.comparePlans();
    if (!plans.length) {
      return [] as readonly { id: string; label: string; cells: readonly PlanFeature[] }[];
    }

    const labels = new Map<string, string>();
    for (const plan of plans) {
      for (const feature of plan.features) {
        if (!labels.has(feature.id)) labels.set(feature.id, feature.label);
      }
    }

    return [...labels.entries()].map(([id, label]) => ({
      id,
      label,
      cells: plans.map((plan) => {
        const feature = plan.features.find((f) => f.id === id);
        return feature ?? { id, label, included: false };
      }),
    }));
  });

  setInterval(interval: BillingInterval): void {
    this.viewState.setInterval(interval);
  }

  isCompareSelected(planId: string): boolean {
    return this.viewState.comparePlanIds().includes(planId);
  }

  onSelectPlan(_plan: SubscriptionPlan | string): void {
    void _plan;
    // Selection is reserved for upgrade flows; compare toggles handle multi-select.
  }

  onToggleCompare(plan: SubscriptionPlan | string): void {
    const id = typeof plan === 'string' ? plan : plan.id;
    this.viewState.toggleComparePlan(id);
  }

  priceLabel(plan: SubscriptionPlan): string {
    if (plan.enterprise) return 'Custom';
    const amount = this.interval() === 'annual' ? plan.annualPrice : plan.monthlyPrice;
    return `${formatRupees(amount)} / ${this.interval() === 'annual' ? 'yr' : 'mo'}`;
  }
}
