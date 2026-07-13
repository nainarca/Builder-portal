import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-sa-chart-legend',
  template: `
    <div class="sa-chart-legend" role="list">
      @for (item of items(); track item.label) {
        <span class="sa-chart-legend__item" role="listitem">
          <span class="sa-chart-legend__swatch" [style.background]="item.color"></span>
          {{ item.label }}
        </span>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartLegendComponent {
  readonly items = input.required<readonly { label: string; color: string }[]>();
}
