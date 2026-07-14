import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { SubscriptionRecord } from '../../models/billing-admin.model';
import { BillPaymentStatusBadgeComponent } from './bill-payment-status-badge.component';

@Component({
  selector: 'app-bill-subscription-card',
  imports: [BillPaymentStatusBadgeComponent],
  template: `
    <article class="bill-subscription-card">
      <button
        type="button"
        class="bill-subscription-card__button"
        (click)="selectSubscription.emit(subscription())"
      >
        <header class="bill-subscription-card__header">
          <div class="bill-subscription-card__titles">
            <h3 class="bill-subscription-card__org">{{ subscription().organizationName }}</h3>
            <p class="bill-subscription-card__plan">{{ subscription().planName }}</p>
          </div>
          <app-bill-payment-status-badge [status]="subscription().status" />
        </header>

        <dl class="bill-subscription-card__meta">
          <div class="bill-subscription-card__row">
            <dt>Renews</dt>
            <dd>
              <time [attr.datetime]="subscription().renewsAt">
                {{ formatDate(subscription().renewsAt) }}
              </time>
            </dd>
          </div>
          <div class="bill-subscription-card__row">
            <dt>Seats</dt>
            <dd>{{ subscription().seatsUsed }} / {{ subscription().seats }}</dd>
          </div>
        </dl>
      </button>
    </article>
  `,
  styles: `
    .bill-subscription-card {
      background: var(--mpa-color-surface);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-lg, 0.75rem);
      overflow: hidden;
      transition:
        border-color 0.15s ease,
        box-shadow 0.15s ease;
    }

    .bill-subscription-card:hover {
      border-color: color-mix(in srgb, var(--mpa-color-primary) 35%, var(--mpa-color-border));
      box-shadow: 0 1px 0 color-mix(in srgb, var(--mpa-color-text) 4%, transparent);
    }

    .bill-subscription-card__button {
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-md, 1rem);
      width: 100%;
      padding: var(--mpa-spacing-md, 1.15rem);
      border: 0;
      background: transparent;
      text-align: left;
      cursor: pointer;
      font: inherit;
      color: inherit;
    }

    .bill-subscription-card__header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 0.75rem;
    }

    .bill-subscription-card__titles {
      min-width: 0;
    }

    .bill-subscription-card__org {
      margin: 0 0 0.2rem;
      font-size: var(--mpa-font-size-md, 1rem);
      font-weight: 700;
      color: var(--mpa-color-text);
    }

    .bill-subscription-card__plan {
      margin: 0;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text-muted);
    }

    .bill-subscription-card__meta {
      display: flex;
      flex-direction: column;
      gap: 0.45rem;
      margin: 0;
    }

    .bill-subscription-card__row {
      display: flex;
      justify-content: space-between;
      gap: 0.75rem;
      font-size: var(--mpa-font-size-sm, 0.875rem);
    }

    .bill-subscription-card__row dt {
      margin: 0;
      color: var(--mpa-color-text-muted);
      font-weight: 500;
    }

    .bill-subscription-card__row dd {
      margin: 0;
      font-weight: 600;
      color: var(--mpa-color-text);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillSubscriptionCardComponent {
  readonly subscription = input.required<SubscriptionRecord>();
  readonly selectSubscription = output<SubscriptionRecord>();

  formatDate(iso: string): string {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(iso));
  }
}
