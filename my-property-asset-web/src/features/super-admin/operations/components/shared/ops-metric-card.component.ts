import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { MonitoringMetric } from '../../models/operations-admin.model';

@Component({
  selector: 'app-ops-trend-chart',
  template: `
    <svg
      class="ops-trend"
      [attr.viewBox]="'0 0 ' + width + ' ' + height"
      role="img"
      [attr.aria-label]="label() + ' trend'"
    >
      <polyline class="ops-trend__line" fill="none" [attr.points]="polyline()" />
      @for (pt of circles(); track pt.x) {
        <circle class="ops-trend__dot" [attr.cx]="pt.x" [attr.cy]="pt.y" r="2.5" />
      }
    </svg>
  `,
  styles: `
    .ops-trend { width: 100%; height: 48px; display: block; }
    .ops-trend__line {
      stroke: var(--mpa-color-primary);
      stroke-width: 2;
      stroke-linejoin: round;
      stroke-linecap: round;
    }
    .ops-trend__dot { fill: var(--mpa-color-primary); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpsTrendChartComponent {
  readonly points = input.required<readonly { label: string; value: number }[]>();
  readonly label = input('');
  readonly width = 220;
  readonly height = 48;

  readonly polyline = computed(() => this.normalized().map((p) => `${p.x},${p.y}`).join(' '));
  readonly circles = computed(() => this.normalized());

  private normalized(): { x: number; y: number }[] {
    const data = this.points();
    if (!data.length) return [];
    const values = data.map((d) => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const pad = 4;
    return data.map((d, i) => {
      const x = pad + (i / Math.max(data.length - 1, 1)) * (this.width - pad * 2);
      const y = this.height - pad - ((d.value - min) / range) * (this.height - pad * 2);
      return { x, y };
    });
  }
}

@Component({
  selector: 'app-ops-metric-card',
  imports: [OpsTrendChartComponent],
  template: `
    @if (metric(); as m) {
      <article class="ops-metric-card">
        <header class="ops-metric-card__head">
          <span class="ops-metric-card__label">{{ m.label }}</span>
          <span class="ops-metric-card__trend ops-metric-card__trend--{{ m.trend }}">
            <i [class]="trendIcon()" aria-hidden="true"></i>
            {{ m.deltaPercent > 0 ? '+' : '' }}{{ m.deltaPercent }}%
          </span>
        </header>
        <p class="ops-metric-card__value">
          {{ displayValue() }}<span class="ops-metric-card__unit">{{ m.unit }}</span>
        </p>
        <app-ops-trend-chart [points]="m.series" [label]="m.label" />
      </article>
    }
  `,
  styles: `
    .ops-metric-card {
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
      padding: 1.15rem;
      background: var(--mpa-color-surface);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-md, 0.5rem);
    }
    .ops-metric-card__head { display: flex; justify-content: space-between; gap: 0.5rem; }
    .ops-metric-card__label {
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text-muted);
      font-weight: 500;
    }
    .ops-metric-card__trend {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      font-size: var(--mpa-font-size-xs, 0.75rem);
      font-weight: 600;
    }
    .ops-metric-card__trend--up { color: var(--mpa-color-danger, #dc2626); }
    .ops-metric-card__trend--down { color: var(--mpa-color-success, #16a34a); }
    .ops-metric-card__trend--flat { color: var(--mpa-color-text-muted); }
    .ops-metric-card__value {
      margin: 0;
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--mpa-color-text);
      letter-spacing: -0.02em;
    }
    .ops-metric-card__unit {
      margin-left: 0.35rem;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      font-weight: 500;
      color: var(--mpa-color-text-muted);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpsMetricCardComponent {
  readonly metric = input.required<MonitoringMetric>();

  readonly displayValue = computed(() => {
    const m = this.metric();
    return Number.isInteger(m.value) ? m.value : m.value.toFixed(2);
  });

  readonly trendIcon = computed(() => {
    const t = this.metric().trend;
    if (t === 'up') return 'pi pi-arrow-up';
    if (t === 'down') return 'pi pi-arrow-down';
    return 'pi pi-minus';
  });
}
