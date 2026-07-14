import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { formatRupees } from '../../config/billing.config';
import { BillingInterval, SubscriptionPlan } from '../../models/billing-admin.model';
import { BillPricingBadgeComponent } from './bill-pricing-badge.component';

@Component({
  selector: 'app-bill-plan-card',
  imports: [BillPricingBadgeComponent],
  template: `
    <article
      class="bill-plan-card"
      [class.bill-plan-card--selected]="selected()"
      [class.bill-plan-card--popular]="plan().popular"
      [class.bill-plan-card--enterprise]="plan().enterprise"
    >
      <header class="bill-plan-card__header">
        <div class="bill-plan-card__badges">
          @if (plan().popular) {
            <app-bill-pricing-badge label="Popular" tone="popular" />
          }
          @if (plan().enterprise) {
            <app-bill-pricing-badge label="Enterprise" tone="enterprise" />
          }
        </div>
        <h3 class="bill-plan-card__name">{{ plan().name }}</h3>
        <p class="bill-plan-card__description">{{ plan().description }}</p>
        <p class="bill-plan-card__price">
          <span class="bill-plan-card__amount">{{ priceLabel() }}</span>
          @if (!plan().enterprise) {
            <span class="bill-plan-card__interval">/ {{ interval() === 'annual' ? 'yr' : 'mo' }}</span>
          }
        </p>
      </header>

      <ul class="bill-plan-card__features">
        @for (feature of includedFeatures(); track feature.id) {
          <li
            class="bill-plan-card__feature"
            [class.bill-plan-card__feature--highlight]="feature.highlight"
          >
            <i class="pi pi-check" aria-hidden="true"></i>
            <span>{{ feature.label }}</span>
          </li>
        }
      </ul>

      <footer class="bill-plan-card__actions">
        <button type="button" class="bill-plan-card__primary" (click)="selectPlan.emit(plan())">
          Select plan
        </button>
        <button
          type="button"
          class="bill-plan-card__compare"
          [attr.aria-pressed]="selected()"
          (click)="toggleCompare.emit(plan())"
        >
          {{ selected() ? 'Comparing' : 'Compare' }}
        </button>
      </footer>
    </article>
  `,
  styles: `
    .bill-plan-card {
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-md, 1rem);
      height: 100%;
      padding: var(--mpa-spacing-md, 1.25rem);
      background: var(--mpa-color-surface);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-lg, 0.75rem);
      transition:
        border-color 0.15s ease,
        box-shadow 0.15s ease;
    }

    .bill-plan-card--popular {
      border-color: color-mix(in srgb, var(--mpa-color-primary) 40%, var(--mpa-color-border));
    }

    .bill-plan-card--selected {
      border-color: var(--mpa-color-primary);
      box-shadow: 0 0 0 1px color-mix(in srgb, var(--mpa-color-primary) 35%, transparent);
    }

    .bill-plan-card__header {
      display: flex;
      flex-direction: column;
      gap: 0.45rem;
    }

    .bill-plan-card__badges {
      display: flex;
      flex-wrap: wrap;
      gap: 0.35rem;
      min-height: 1.35rem;
    }

    .bill-plan-card__name {
      margin: 0;
      font-size: var(--mpa-font-size-lg, 1.125rem);
      font-weight: 700;
      color: var(--mpa-color-text);
    }

    .bill-plan-card__description {
      margin: 0;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      line-height: 1.45;
      color: var(--mpa-color-text-muted);
    }

    .bill-plan-card__price {
      margin: 0.35rem 0 0;
      display: flex;
      align-items: baseline;
      gap: 0.3rem;
    }

    .bill-plan-card__amount {
      font-size: var(--mpa-font-size-xl, 1.5rem);
      font-weight: 700;
      color: var(--mpa-color-text);
    }

    .bill-plan-card__interval {
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text-muted);
    }

    .bill-plan-card__features {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      flex: 1;
    }

    .bill-plan-card__feature {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text);
    }

    .bill-plan-card__feature > i {
      margin-top: 0.15rem;
      color: var(--mpa-color-success);
      flex: none;
    }

    .bill-plan-card__feature--highlight {
      font-weight: 600;
    }

    .bill-plan-card__actions {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-top: auto;
    }

    .bill-plan-card__primary,
    .bill-plan-card__compare {
      font: inherit;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      font-weight: 600;
      padding: 0.55rem 0.85rem;
      border-radius: var(--mpa-radius-md, 0.5rem);
      cursor: pointer;
    }

    .bill-plan-card__primary {
      border: 0;
      background: var(--mpa-color-primary);
      color: var(--mpa-color-on-primary, #fff);
    }

    .bill-plan-card__compare {
      border: 1px solid var(--mpa-color-border);
      background: transparent;
      color: var(--mpa-color-text-muted);
    }

    .bill-plan-card__compare[aria-pressed='true'] {
      border-color: var(--mpa-color-primary);
      color: var(--mpa-color-primary);
      background: color-mix(in srgb, var(--mpa-color-primary) 10%, transparent);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillPlanCardComponent {
  readonly plan = input.required<SubscriptionPlan>();
  readonly interval = input<BillingInterval>('monthly');
  readonly selected = input(false);

  readonly selectPlan = output<SubscriptionPlan>();
  readonly toggleCompare = output<SubscriptionPlan>();

  readonly includedFeatures = computed(() => this.plan().features.filter((f) => f.included));

  readonly priceLabel = computed(() => {
    const plan = this.plan();
    if (plan.enterprise) return 'Custom';
    const amount = this.interval() === 'annual' ? plan.annualPrice : plan.monthlyPrice;
    return formatRupees(amount);
  });
}
