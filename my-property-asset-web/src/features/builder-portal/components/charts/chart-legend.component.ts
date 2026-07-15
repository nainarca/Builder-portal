import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-bp-chart-legend',
  template: `
    <div class="bp-chart-legend" role="list">
      @for (item of items(); track item.label) {
        <span class="bp-chart-legend__item" role="listitem">
          <span class="bp-chart-legend__swatch" [style.background]="item.color"></span>
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
