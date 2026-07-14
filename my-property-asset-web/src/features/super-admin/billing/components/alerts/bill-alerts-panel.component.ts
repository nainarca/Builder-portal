import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonComponent } from '@shared/ui';

import { BillingAdminStoreService } from '../../services/billing-admin-store.service';
import { BillingViewStateService } from '../../services/billing-view-state.service';

@Component({
  selector: 'app-bill-alerts-panel',
  imports: [RouterLink, ButtonComponent],
  template: `
    <section class="bill-alerts-panel" aria-label="Commercial alerts">
      <header class="bill-alerts-panel__header">
        <div>
          <h2 class="bill-alerts-panel__title">Alerts</h2>
          <p class="bill-alerts-panel__subtitle">
            Trials, renewals, payments, and license risk.
          </p>
        </div>
        <div class="bill-alerts-panel__filters" role="group" aria-label="Alert filter">
          @for (filter of filters; track filter.id) {
            <button
              type="button"
              class="bill-alerts-panel__chip"
              [class.bill-alerts-panel__chip--active]="viewState.alertFilter() === filter.id"
              (click)="viewState.setAlertFilter(filter.id)"
            >
              {{ filter.label }}
            </button>
          }
        </div>
      </header>

      <ul class="bill-alerts-panel__list">
        @for (alert of filtered(); track alert.id) {
          <li
            class="bill-alert"
            [class.bill-alert--info]="alert.severity === 'info'"
            [class.bill-alert--warning]="alert.severity === 'warning'"
            [class.bill-alert--critical]="alert.severity === 'critical'"
          >
            <div class="bill-alert__body">
              <div class="bill-alert__top">
                <span class="bill-alert__severity">{{ alert.severity }}</span>
                @if (alert.acknowledged) {
                  <span class="bill-alert__acked">Acknowledged</span>
                }
              </div>
              <h3 class="bill-alert__title">{{ alert.title }}</h3>
              <p class="bill-alert__message">{{ alert.message }}</p>
              <div class="bill-alert__meta">
                <span>{{ alert.organizationName }}</span>
                <time [attr.datetime]="alert.createdAt">{{ formatDate(alert.createdAt) }}</time>
              </div>
            </div>
            <div class="bill-alert__actions">
              @if (alert.actionRoute && alert.actionLabel) {
                <a class="bill-alert__link" [routerLink]="alert.actionRoute">
                  {{ alert.actionLabel }}
                  <i class="pi pi-arrow-right" aria-hidden="true"></i>
                </a>
              }
              @if (!alert.acknowledged) {
                <app-button
                  label="Acknowledge"
                  icon="pi pi-check"
                  severity="secondary"
                  [outlined]="true"
                  size="small"
                  (clicked)="acknowledge(alert.id)"
                />
              }
            </div>
          </li>
        } @empty {
          <li class="bill-alerts-panel__empty">No alerts for this filter.</li>
        }
      </ul>
    </section>
  `,
  styles: `
    .bill-alerts-panel {
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-md, 1.25rem);
    }

    .bill-alerts-panel__header {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-end;
      justify-content: space-between;
      gap: 1rem;
    }

    .bill-alerts-panel__title {
      margin: 0 0 0.25rem;
      font-size: var(--mpa-font-size-lg, 1.125rem);
      font-weight: 700;
      color: var(--mpa-color-text);
    }

    .bill-alerts-panel__subtitle {
      margin: 0;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text-muted);
    }

    .bill-alerts-panel__filters {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .bill-alerts-panel__chip {
      border: 1px solid var(--mpa-color-border);
      background: var(--mpa-color-surface);
      color: var(--mpa-color-text-muted);
      font: inherit;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      font-weight: 600;
      padding: 0.4rem 0.85rem;
      border-radius: 999px;
      cursor: pointer;
    }

    .bill-alerts-panel__chip--active {
      border-color: var(--mpa-color-primary);
      background: color-mix(in srgb, var(--mpa-color-primary) 12%, transparent);
      color: var(--mpa-color-primary);
    }

    .bill-alerts-panel__list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .bill-alert {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 1rem;
      padding: var(--mpa-spacing-md, 1.15rem);
      background: var(--mpa-color-surface);
      border: 1px solid var(--mpa-color-border);
      border-left-width: 3px;
      border-radius: var(--mpa-radius-md, 0.5rem);
    }

    .bill-alert--info {
      border-left-color: var(--mpa-color-primary);
    }

    .bill-alert--warning {
      border-left-color: var(--mpa-color-warning);
    }

    .bill-alert--critical {
      border-left-color: var(--mpa-color-danger);
    }

    .bill-alert__body {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      min-width: 0;
      flex: 1;
    }

    .bill-alert__top {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      align-items: center;
    }

    .bill-alert__severity {
      font-size: var(--mpa-font-size-xs, 0.75rem);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--mpa-color-text-muted);
    }

    .bill-alert__acked {
      font-size: var(--mpa-font-size-xs, 0.75rem);
      font-weight: 600;
      padding: 0.1rem 0.45rem;
      border-radius: 999px;
      background: color-mix(in srgb, var(--mpa-color-success) 14%, transparent);
      color: var(--mpa-color-success);
    }

    .bill-alert__title {
      margin: 0;
      font-size: var(--mpa-font-size-md, 1rem);
      color: var(--mpa-color-text);
    }

    .bill-alert__message {
      margin: 0;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text-muted);
      line-height: 1.45;
    }

    .bill-alert__meta {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-top: 0.25rem;
      font-size: var(--mpa-font-size-xs, 0.75rem);
      color: var(--mpa-color-text-muted);
    }

    .bill-alert__actions {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.65rem;
    }

    .bill-alert__link {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      color: var(--mpa-color-primary);
      text-decoration: none;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      font-weight: 600;
    }

    .bill-alerts-panel__empty {
      padding: var(--mpa-spacing-md, 1.25rem);
      color: var(--mpa-color-text-muted);
      border: 1px dashed var(--mpa-color-border);
      border-radius: var(--mpa-radius-md, 0.5rem);
      font-size: var(--mpa-font-size-sm, 0.875rem);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillAlertsPanelComponent {
  readonly store = inject(BillingAdminStoreService);
  readonly viewState = inject(BillingViewStateService);

  readonly filters = [
    { id: 'all' as const, label: 'All' },
    { id: 'open' as const, label: 'Open' },
    { id: 'acknowledged' as const, label: 'Acknowledged' },
  ];

  readonly filtered = computed(() => {
    const filter = this.viewState.alertFilter();
    const alerts = this.store.alerts();
    if (filter === 'open') return alerts.filter((a) => !a.acknowledged);
    if (filter === 'acknowledged') return alerts.filter((a) => a.acknowledged);
    return alerts;
  });

  acknowledge(id: string): void {
    this.store.acknowledgeAlert(id);
  }

  formatDate(iso: string): string {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(iso));
  }
}
