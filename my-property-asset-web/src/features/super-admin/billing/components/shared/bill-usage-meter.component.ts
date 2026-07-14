import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { UsageMetric } from '../../models/billing-admin.model';

@Component({
  selector: 'app-bill-usage-meter',
  template: `
    <article [class]="'bill-usage-meter ' + toneClass()">
      <header class="bill-usage-meter__header">
        <h3 class="bill-usage-meter__label">{{ metric().label }}</h3>
        @if (metric().placeholder) {
          <span class="bill-usage-meter__pill">Placeholder</span>
        }
      </header>

      <div
        class="bill-usage-meter__track"
        role="progressbar"
        [attr.aria-valuenow]="percent()"
        aria-valuemin="0"
        aria-valuemax="100"
        [attr.aria-label]="metric().label + ' usage'"
      >
        <div class="bill-usage-meter__fill" [style.width.%]="percent()"></div>
      </div>

      <div class="bill-usage-meter__footer">
        <span class="bill-usage-meter__values">
          {{ metric().used }} / {{ metric().limit }} {{ metric().unit }}
        </span>
        <span class="bill-usage-meter__percent">{{ percent() }}%</span>
      </div>
    </article>
  `,
  styles: `
    .bill-usage-meter {
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
      padding: var(--mpa-spacing-md, 1.15rem);
      background: var(--mpa-color-surface);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-md, 0.5rem);
    }

    .bill-usage-meter__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
    }

    .bill-usage-meter__label {
      margin: 0;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      font-weight: 700;
      color: var(--mpa-color-text);
    }

    .bill-usage-meter__pill {
      font-size: var(--mpa-font-size-xs, 0.75rem);
      font-weight: 600;
      padding: 0.15rem 0.5rem;
      border-radius: 999px;
      color: var(--mpa-color-text-muted);
      background: color-mix(in srgb, var(--mpa-color-text-muted) 12%, transparent);
      border: 1px solid var(--mpa-color-border);
    }

    .bill-usage-meter__track {
      height: 0.5rem;
      border-radius: 999px;
      background: color-mix(in srgb, var(--mpa-color-border) 80%, transparent);
      overflow: hidden;
    }

    .bill-usage-meter__fill {
      height: 100%;
      border-radius: inherit;
      background: var(--mpa-color-primary);
      transition: width 0.2s ease;
    }

    .bill-usage-meter--warn .bill-usage-meter__fill {
      background: var(--mpa-color-warning);
    }

    .bill-usage-meter--danger .bill-usage-meter__fill {
      background: var(--mpa-color-danger);
    }

    .bill-usage-meter__footer {
      display: flex;
      justify-content: space-between;
      gap: 0.5rem;
      font-size: var(--mpa-font-size-xs, 0.75rem);
      color: var(--mpa-color-text-muted);
    }

    .bill-usage-meter__percent {
      font-weight: 700;
      color: var(--mpa-color-text);
    }

    .bill-usage-meter--warn .bill-usage-meter__percent {
      color: var(--mpa-color-warning);
    }

    .bill-usage-meter--danger .bill-usage-meter__percent {
      color: var(--mpa-color-danger);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillUsageMeterComponent {
  readonly metric = input.required<UsageMetric>();

  readonly percent = computed(() => {
    const { used, limit } = this.metric();
    if (!limit) return 0;
    return Math.min(100, Math.round((used / limit) * 100));
  });

  readonly toneClass = computed(() => {
    const pct = this.percent();
    if (pct >= 95) return 'bill-usage-meter--danger';
    if (pct >= 80) return 'bill-usage-meter--warn';
    return 'bill-usage-meter--ok';
  });
}
