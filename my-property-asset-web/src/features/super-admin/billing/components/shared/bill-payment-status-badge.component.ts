import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import {
  InvoiceStatus,
  LicenseStatus,
  PaymentStatus,
  SubscriptionStatus,
} from '../../models/billing-admin.model';

type StatusTone = 'success' | 'warning' | 'danger' | 'info' | 'muted';

type AnyBillingStatus = PaymentStatus | InvoiceStatus | SubscriptionStatus | LicenseStatus;

const STATUS_TONES: Record<AnyBillingStatus, StatusTone> = {
  succeeded: 'success',
  paid: 'success',
  active: 'success',
  pending: 'warning',
  trial: 'info',
  open: 'info',
  draft: 'muted',
  not_configured: 'muted',
  expired: 'danger',
  canceled: 'muted',
  past_due: 'danger',
  failed: 'danger',
  void: 'muted',
  exhausted: 'danger',
  expiring: 'warning',
  revoked: 'danger',
};

const STATUS_LABELS: Record<AnyBillingStatus, string> = {
  succeeded: 'Succeeded',
  paid: 'Paid',
  active: 'Active',
  pending: 'Pending',
  trial: 'Trial',
  open: 'Open',
  draft: 'Draft',
  not_configured: 'Not configured',
  expired: 'Expired',
  canceled: 'Canceled',
  past_due: 'Past due',
  failed: 'Failed',
  void: 'Void',
  exhausted: 'Exhausted',
  expiring: 'Expiring',
  revoked: 'Revoked',
};

@Component({
  selector: 'app-bill-payment-status-badge',
  template: `
    <span [class]="'bill-payment-status-badge ' + toneClass()">
      <span class="bill-payment-status-badge__dot" aria-hidden="true"></span>
      {{ displayLabel() }}
    </span>
  `,
  styles: `
    .bill-payment-status-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.2rem 0.55rem;
      border-radius: 999px;
      font-size: var(--mpa-font-size-xs, 0.75rem);
      font-weight: 600;
      line-height: 1.2;
      border: 1px solid transparent;
      text-transform: capitalize;
    }

    .bill-payment-status-badge__dot {
      width: 0.4rem;
      height: 0.4rem;
      border-radius: 50%;
      flex: none;
      background: currentColor;
    }

    .bill-payment-status-badge--success {
      color: var(--mpa-color-success);
      background: color-mix(in srgb, var(--mpa-color-success) 12%, transparent);
      border-color: color-mix(in srgb, var(--mpa-color-success) 28%, transparent);
    }

    .bill-payment-status-badge--warning {
      color: var(--mpa-color-warning);
      background: color-mix(in srgb, var(--mpa-color-warning) 12%, transparent);
      border-color: color-mix(in srgb, var(--mpa-color-warning) 28%, transparent);
    }

    .bill-payment-status-badge--danger {
      color: var(--mpa-color-danger);
      background: color-mix(in srgb, var(--mpa-color-danger) 12%, transparent);
      border-color: color-mix(in srgb, var(--mpa-color-danger) 28%, transparent);
    }

    .bill-payment-status-badge--info {
      color: var(--mpa-color-primary);
      background: color-mix(in srgb, var(--mpa-color-primary) 12%, transparent);
      border-color: color-mix(in srgb, var(--mpa-color-primary) 28%, transparent);
    }

    .bill-payment-status-badge--muted {
      color: var(--mpa-color-text-muted);
      background: color-mix(in srgb, var(--mpa-color-text-muted) 10%, transparent);
      border-color: var(--mpa-color-border);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillPaymentStatusBadgeComponent {
  readonly status = input.required<AnyBillingStatus>();

  readonly toneClass = computed(
    () => `bill-payment-status-badge--${STATUS_TONES[this.status()]}`,
  );

  readonly displayLabel = computed(() => STATUS_LABELS[this.status()]);
}
