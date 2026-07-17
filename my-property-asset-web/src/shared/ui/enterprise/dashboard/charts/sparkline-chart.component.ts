import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { buildLinePath } from './utils/chart.utils';
import { EnterpriseChartEmptyComponent } from './chart-states.component';

@Component({
  selector: 'app-enterprise-sparkline-chart',
  imports: [EnterpriseChartEmptyComponent],
  template: `
    @if (!hasData()) {
      <app-enterprise-chart-empty title="No trend" message="No sparkline data" />
    } @else {
      <svg
        class="enterprise-sparkline-chart"
        [attr.viewBox]="'0 0 ' + width + ' ' + height"
        preserveAspectRatio="none"
        role="img"
        [attr.aria-label]="ariaLabel()"
      >
        <path [attr.d]="path()" fill="none" [attr.stroke]="color()" stroke-width="2" stroke-linecap="round" />
      </svg>
    }
  `,
  styles: `
    .enterprise-sparkline-chart {
      width: 100%; height: 2.5rem; display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseSparklineChartComponent {
  readonly config = input<{ series: readonly { values: readonly number[] }[] } | undefined>(undefined);
  readonly values = input<readonly number[]>([]);
  readonly color = input('var(--mpa-color-primary)');
  readonly ariaLabel = input('Sparkline trend');
  readonly width = 120;
  readonly height = 40;

  readonly resolvedValues = computed(() => {
    const fromConfig = this.config()?.series[0]?.values;
    return fromConfig?.length ? fromConfig : this.values();
  });

  readonly hasData = computed(() => this.resolvedValues().some((value) => value > 0));

  path(): string {
    return buildLinePath(this.resolvedValues(), this.width, this.height, 2);
  }
}
