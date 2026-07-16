import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthorizedButtonComponent } from '@core/rbac';
import { BasePageComponent, PageHeaderComponent, UiToastService } from '@shared/ui';
import { formatMoney, SUBSCRIPTION_WORKSPACE_HEADER } from '../config/subscription.config';
import { SubscriptionService } from '../services/subscription.service';

@Component({
  selector: 'app-subscription-overview-page',
  imports: [
    RouterLink,
    BasePageComponent,
    PageHeaderComponent,
    AuthorizedButtonComponent,
  ],
  template: `
    <app-base-page>
      <div class="sub-page">
        <app-page-header
          [eyebrow]="header.eyebrow"
          [title]="header.title"
          [description]="header.description"
        >
          <app-authorized-button
            pageActions
            label="Upgrade"
            icon="pi pi-arrow-up"
            permission="id-05-subscription-commercial:operate"
            (clicked)="goToPlans()"
          />
          <app-authorized-button
            pageActions
            label="Renew"
            icon="pi pi-refresh"
            [outlined]="true"
            permission="id-05-subscription-commercial:operate"
            (clicked)="renew()"
          />
        </app-page-header>

        @if (summary(); as s) {
          <section class="sub-card">
            <h2>Current plan</h2>
            <p class="sub-card__plan">{{ s.plan?.name ?? 'No plan' }}</p>
            <p>Status: <strong>{{ s.subscription?.status ?? 'none' }}</strong></p>
            <p>Expiry / renewal: <strong>{{ formatDate(s.subscription?.renewsAt) }}</strong></p>
            @if (s.daysUntilExpiry !== null) {
              <p>{{ s.daysUntilExpiry }} days remaining</p>
            }
            <p>Amount: <strong>{{ formatAmount(s.subscription?.amountMinor ?? 0, s.subscription?.currency) }}</strong></p>
          </section>

          <section class="sub-grid">
            <article class="sub-card">
              <h3>Usage</h3>
              <ul>
                <li>Projects: {{ s.usage.projects }} / {{ limitValue(s.plan?.limits?.projects) }}</li>
                <li>Buildings: {{ s.usage.buildings }} / {{ limitValue(s.plan?.limits?.buildings) }}</li>
                <li>Units: {{ s.usage.units }} / {{ limitValue(s.plan?.limits?.units) }}</li>
                <li>Owners: {{ s.usage.owners }} / {{ limitValue(s.plan?.limits?.owners) }}</li>
                <li>Staff: {{ s.usage.staff }} / {{ limitValue(s.plan?.limits?.staff) }}</li>
                <li>Storage: {{ s.usage.storageGb }} / {{ limitValue(s.plan?.limits?.storageGb) }} GB</li>
                <li>Notifications: {{ s.usage.monthlyNotifications }} / {{ limitValue(s.plan?.limits?.monthlyNotifications) }}</li>
              </ul>
            </article>
            <article class="sub-card">
              <h3>Remaining limits</h3>
              <ul>
                <li>Projects left: {{ remainingNumber(s.remaining.projects) }}</li>
                <li>Units left: {{ remainingNumber(s.remaining.units) }}</li>
                <li>White label: {{ s.remaining.whiteLabel ? 'Enabled' : 'Not included' }}</li>
                <li>Priority support: {{ s.remaining.prioritySupport ? 'Included' : 'Not included' }}</li>
              </ul>
              <a routerLink="/builder-portal/subscription/invoices">View invoices & payments</a>
            </article>
          </section>
        }
      </div>
    </app-base-page>
  `,
  styles: `
    .sub-page { display: grid; gap: 1rem; }
    .sub-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
    .sub-card {
      background: var(--mpa-color-surface);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-lg, 0.75rem);
      padding: 1rem;
    }
    .sub-card__plan { font-size: 1.5rem; font-weight: 700; margin: 0.25rem 0 0.75rem; }
    ul { margin: 0; padding-left: 1.1rem; display: grid; gap: 0.35rem; }
    a { color: var(--mpa-color-primary); font-weight: 600; }
    @media (max-width: 900px) { .sub-grid { grid-template-columns: 1fr; } }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionOverviewPageComponent {
  private readonly subscriptionService = inject(SubscriptionService);
  private readonly toast = inject(UiToastService);
  private readonly router = inject(Router);

  readonly header = SUBSCRIPTION_WORKSPACE_HEADER;
  readonly summary = this.subscriptionService.summary;

  goToPlans(): void {
    void this.router.navigate(['/builder-portal/subscription/plans']);
  }

  renew(): void {
    const renewed = this.subscriptionService.renew();
    if (!renewed) {
      this.toast.error('Renewal failed', 'No active subscription to renew.');
      return;
    }
    void this.subscriptionService.beginRenewalCheckout().then((result) => {
      this.toast.success('Renewal prepared', result.message);
    });
  }

  formatDate(value?: string): string {
    return value ? new Date(value).toLocaleDateString() : '—';
  }

  formatAmount(amountMinor: number, currency?: string): string {
    return formatMoney(amountMinor, currency ?? 'INR');
  }

  remainingNumber(value: number | boolean | undefined): string {
    return typeof value === 'number' ? String(value) : '—';
  }

  limitValue(value: number | undefined): string {
    return value === undefined ? '—' : String(value);
  }
}
