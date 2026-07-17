import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-enterprise-chart-toolbar',
  template: `
    <div class="enterprise-chart__header">
      <div>
        @if (title()) {
          <h3 class="enterprise-chart__title">{{ title() }}</h3>
        }
        @if (subtitle()) {
          <p class="enterprise-chart__subtitle">{{ subtitle() }}</p>
        }
      </div>
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseChartToolbarComponent {
  readonly title = input<string | undefined>(undefined);
  readonly subtitle = input<string | undefined>(undefined);
}

@Component({
  selector: 'app-enterprise-chart-legend',
  template: `
    <div class="enterprise-chart-legend" role="list" [attr.aria-label]="ariaLabel()">
      @for (item of items(); track item.label) {
        <span class="enterprise-chart-legend__item" role="listitem">
          <span class="enterprise-chart-legend__swatch" [style.background]="item.color"></span>
          {{ item.label }}
        </span>
      }
    </div>
  `,
  styles: `
    .enterprise-chart-legend {
      display: flex; flex-wrap: wrap; gap: var(--mpa-spacing-sm);
      margin-top: var(--mpa-spacing-md);
    }
    .enterprise-chart-legend__item {
      display: inline-flex; align-items: center; gap: var(--mpa-spacing-xs);
      font-size: var(--mpa-font-size-sm); color: var(--mpa-color-text-muted);
    }
    .enterprise-chart-legend__swatch {
      width: 0.65rem; height: 0.65rem; border-radius: var(--mpa-radius-sm);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseChartLegendComponent {
  readonly items = input.required<readonly { label: string; color: string }[]>();
  readonly ariaLabel = input('Chart legend');
}
