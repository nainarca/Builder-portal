import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { ButtonComponent, UiToastService } from '@shared/ui';
import { SubscriptionService } from '@features/builder-portal/subscription/services/subscription.service';
import { formatMoney } from '@features/builder-portal/subscription/config/subscription.config';
import { SubscriptionPlanRecord } from '@features/builder-portal/subscription/models/subscription.model';

@Component({
  selector: 'app-plan-admin-panel',
  imports: [ButtonComponent],
  template: `
    <section class="plan-admin" aria-label="Plan administration">
      <header class="plan-admin__header">
        <div>
          <h2>Plan administration</h2>
          <p>Assign plans, extend trials, suspend subscriptions, and deactivate catalog entries.</p>
        </div>
      </header>

      <div class="plan-admin__grid">
        <label>
          Organization ID
          <input [value]="organizationId()" (input)="onOrgId($event)" name="organizationId" />
        </label>
        <label>
          Plan
          <select [value]="selectedPlanId()" (change)="onPlanChange($event)">
            @for (plan of plans; track plan.id) {
              <option [value]="plan.id">{{ plan.name }}</option>
            }
          </select>
        </label>
        <label>
          Trial extension (days)
          <input type="number" min="1" [value]="trialDays()" (input)="onTrialDays($event)" />
        </label>
      </div>

      <div class="plan-admin__actions">
        <app-button label="Assign plan" icon="pi pi-check" (clicked)="assign()" />
        <app-button label="Grant trial" [outlined]="true" (clicked)="grantTrial()" />
        <app-button label="Extend trial" [outlined]="true" (clicked)="extendTrial()" />
        <app-button label="Suspend" severity="warn" [outlined]="true" (clicked)="suspend()" />
        <app-button label="Reactivate" severity="success" [outlined]="true" (clicked)="reactivate()" />
        <app-button
          label="Deactivate selected plan"
          severity="danger"
          [outlined]="true"
          (clicked)="deactivate()"
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Organization</th>
            <th>Plan</th>
            <th>Status</th>
            <th>Renews</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          @for (sub of subscriptions(); track sub.id) {
            <tr>
              <td>{{ sub.organizationId }}</td>
              <td>{{ sub.planName }}</td>
              <td>{{ sub.status }}</td>
              <td>{{ formatDate(sub.renewsAt) }}</td>
              <td>{{ formatMoney(sub.amountMinor, sub.currency) }}</td>
            </tr>
          }
        </tbody>
      </table>
    </section>
  `,
  styles: `
    .plan-admin {
      display: grid;
      gap: 1rem;
      padding: 1rem;
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-lg, 0.75rem);
      background: var(--mpa-color-surface);
    }
    .plan-admin__header h2 {
      margin: 0 0 0.25rem;
    }
    .plan-admin__header p {
      margin: 0;
      color: var(--mpa-color-text-muted);
    }
    .plan-admin__grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 0.75rem;
    }
    label {
      display: grid;
      gap: 0.35rem;
      font-size: 0.875rem;
    }
    input,
    select {
      padding: 0.55rem 0.65rem;
      border: 1px solid var(--mpa-color-border);
      border-radius: 0.5rem;
      background: var(--mpa-color-background);
      color: var(--mpa-color-text);
    }
    .plan-admin__actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th,
    td {
      text-align: left;
      padding: 0.55rem;
      border-bottom: 1px solid var(--mpa-color-border);
    }
    @media (max-width: 900px) {
      .plan-admin__grid {
        grid-template-columns: 1fr;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanAdminPanelComponent {
  private readonly subscriptionService = inject(SubscriptionService);
  private readonly toast = inject(UiToastService);

  readonly organizationId = signal('org-builder-demo');
  readonly plans = this.subscriptionService.listAllPlans();
  readonly selectedPlanId = signal(this.plans[0]?.id ?? 'plan-starter');
  readonly trialDays = signal(7);
  readonly subscriptions = signal(this.subscriptionService.listAllSubscriptions());

  formatMoney = formatMoney;

  onOrgId(event: Event): void {
    this.organizationId.set((event.target as HTMLInputElement).value);
  }

  onPlanChange(event: Event): void {
    this.selectedPlanId.set((event.target as HTMLSelectElement).value);
  }

  onTrialDays(event: Event): void {
    this.trialDays.set(Number((event.target as HTMLInputElement).value) || 1);
  }

  assign(): void {
    this.subscriptionService.assignPlan(this.organizationId(), this.selectedPlanId(), 'active');
    this.refresh('Plan assigned');
  }

  grantTrial(): void {
    this.subscriptionService.assignPlan(this.organizationId(), this.selectedPlanId(), 'trial');
    this.refresh('Trial granted');
  }

  extendTrial(): void {
    this.subscriptionService.extendTrial(this.organizationId(), this.trialDays());
    this.refresh(`Trial extended by ${this.trialDays()} days`);
  }

  suspend(): void {
    this.subscriptionService.suspend(this.organizationId(), 'Suspended by Super Admin');
    this.refresh('Subscription suspended');
  }

  reactivate(): void {
    this.subscriptionService.reactivate(this.organizationId());
    this.refresh('Subscription reactivated');
  }

  deactivate(): void {
    const plan = this.plans.find(
      (item: SubscriptionPlanRecord) => item.id === this.selectedPlanId(),
    );
    this.subscriptionService.deactivatePlan(this.selectedPlanId());
    this.refresh(`${plan?.name ?? 'Plan'} deactivated`);
  }

  formatDate(value?: string): string {
    return value ? new Date(value).toLocaleDateString() : '—';
  }

  private refresh(message: string): void {
    this.subscriptions.set(this.subscriptionService.listAllSubscriptions());
    this.toast.success(message);
  }
}
