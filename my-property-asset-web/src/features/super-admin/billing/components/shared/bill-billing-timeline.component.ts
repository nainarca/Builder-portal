import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { SubscriptionTimelineEvent } from '../../models/billing-admin.model';

const KIND_ICONS: Record<SubscriptionTimelineEvent['kind'], string> = {
  plan: 'pi pi-box',
  invoice: 'pi pi-file',
  license: 'pi pi-key',
  trial: 'pi pi-clock',
  renewal: 'pi pi-sync',
};

@Component({
  selector: 'app-bill-billing-timeline',
  template: `
    <ol class="bill-billing-timeline" aria-label="Billing timeline">
      @for (event of events(); track event.id) {
        <li class="bill-billing-timeline__item" [attr.data-kind]="event.kind">
          <span class="bill-billing-timeline__icon" aria-hidden="true">
            <i [class]="kindIcon(event.kind)"></i>
          </span>
          <div class="bill-billing-timeline__body">
            <div class="bill-billing-timeline__top">
              <h3 class="bill-billing-timeline__title">{{ event.title }}</h3>
              <time class="bill-billing-timeline__time" [attr.datetime]="event.timestamp">
                {{ formatDate(event.timestamp) }}
              </time>
            </div>
            <p class="bill-billing-timeline__description">{{ event.description }}</p>
          </div>
        </li>
      } @empty {
        <li class="bill-billing-timeline__empty">No timeline events yet.</li>
      }
    </ol>
  `,
  styles: `
    .bill-billing-timeline {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .bill-billing-timeline__item {
      display: grid;
      grid-template-columns: 2.25rem 1fr;
      gap: 0.85rem;
      position: relative;
      padding-bottom: var(--mpa-spacing-md, 1.25rem);
    }

    .bill-billing-timeline__item:not(:last-child)::before {
      content: '';
      position: absolute;
      left: 1.05rem;
      top: 2.25rem;
      bottom: 0;
      width: 2px;
      background: var(--mpa-color-border);
    }

    .bill-billing-timeline__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.25rem;
      height: 2.25rem;
      border-radius: 50%;
      background: color-mix(in srgb, var(--mpa-color-primary) 12%, transparent);
      color: var(--mpa-color-primary);
      z-index: 1;
    }

    .bill-billing-timeline__item[data-kind='invoice'] .bill-billing-timeline__icon {
      background: color-mix(in srgb, var(--mpa-color-danger) 12%, transparent);
      color: var(--mpa-color-danger);
    }

    .bill-billing-timeline__item[data-kind='trial'] .bill-billing-timeline__icon,
    .bill-billing-timeline__item[data-kind='license'] .bill-billing-timeline__icon {
      background: color-mix(in srgb, var(--mpa-color-warning) 14%, transparent);
      color: var(--mpa-color-warning);
    }

    .bill-billing-timeline__item[data-kind='renewal'] .bill-billing-timeline__icon {
      background: color-mix(in srgb, var(--mpa-color-success) 12%, transparent);
      color: var(--mpa-color-success);
    }

    .bill-billing-timeline__body {
      min-width: 0;
      padding-top: 0.15rem;
    }

    .bill-billing-timeline__top {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      justify-content: space-between;
      gap: 0.5rem;
    }

    .bill-billing-timeline__title {
      margin: 0;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      font-weight: 700;
      color: var(--mpa-color-text);
    }

    .bill-billing-timeline__time {
      font-size: var(--mpa-font-size-xs, 0.75rem);
      color: var(--mpa-color-text-muted);
    }

    .bill-billing-timeline__description {
      margin: 0.35rem 0 0;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      line-height: 1.45;
      color: var(--mpa-color-text-muted);
    }

    .bill-billing-timeline__empty {
      padding: var(--mpa-spacing-md, 1.25rem);
      color: var(--mpa-color-text-muted);
      font-size: var(--mpa-font-size-sm, 0.875rem);
      border: 1px dashed var(--mpa-color-border);
      border-radius: var(--mpa-radius-md, 0.5rem);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillBillingTimelineComponent {
  readonly events = input.required<readonly SubscriptionTimelineEvent[]>();

  kindIcon(kind: SubscriptionTimelineEvent['kind']): string {
    return KIND_ICONS[kind];
  }

  formatDate(iso: string): string {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(iso));
  }
}
