import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthorizedButtonComponent } from '@core/rbac';
import { BasePageComponent, PageHeaderComponent, UiToastService } from '@shared/ui';
import { formatMoney } from '../config/subscription.config';
import { SubscriptionService } from '../services/subscription.service';

@Component({
  selector: 'app-subscription-plans-page',
  imports: [RouterLink, BasePageComponent, PageHeaderComponent, AuthorizedButtonComponent],
  template: `
    <app-base-page>
      <div class="plans-page">
        <app-page-header
          eyebrow="Subscription"
          title="Choose a plan"
          description="Upgrade or switch plans. Payment gateway checkout is abstracted and not live in V1."
        >
          <a pageActions routerLink="/builder-portal/subscription">Back to subscription</a>
        </app-page-header>

        <div class="plans-grid">
          @for (plan of plans; track plan.id) {
            <article class="plan-card">
              <h3>{{ plan.name }}</h3>
              <p>{{ plan.description }}</p>
              <p class="plan-card__price">
                {{ plan.monthlyPriceMinor === 0 && plan.annualPriceMinor === 0
                  ? 'Custom pricing'
                  : formatMoney(plan.monthlyPriceMinor) + ' / mo' }}
              </p>
              <ul>
                @for (feature of plan.features; track feature) {
                  <li>{{ feature }}</li>
                }
              </ul>
              <app-authorized-button
                [label]="isCurrent(plan.id) ? 'Current plan' : 'Select plan'"
                permission="id-05-subscription-commercial:operate"
                [disabled]="isCurrent(plan.id)"
                (clicked)="select(plan.id)"
              />
            </article>
          }
        </div>
      </div>
    </app-base-page>
  `,
  styles: `
    .plans-page { display: grid; gap: 1rem; }
    .plans-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr)); gap: 1rem; }
    .plan-card {
      background: var(--mpa-color-surface);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-lg, 0.75rem);
      padding: 1rem;
      display: grid;
      gap: 0.75rem;
    }
    .plan-card__price { font-size: 1.25rem; font-weight: 700; margin: 0; }
    ul { margin: 0; padding-left: 1.1rem; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionPlansPageComponent {
  private readonly subscriptionService = inject(SubscriptionService);
  private readonly toast = inject(UiToastService);

  readonly plans = this.subscriptionService.listPublicPlans();

  isCurrent(planId: string): boolean {
    return this.subscriptionService.getActiveSubscription()?.planId === planId;
  }

  select(planId: string): void {
    const upgraded = this.subscriptionService.upgrade(planId);
    if (!upgraded) {
      this.toast.error('Upgrade failed');
      return;
    }
    this.toast.success('Plan updated', `Now on ${upgraded.planName}.`);
  }

  formatMoney = formatMoney;
}
