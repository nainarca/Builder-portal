import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-sa-chart-toolbar',
  template: `
    <div class="sa-chart__header">
      <div>
        @if (title()) {
          <h3 class="sa-chart__title">{{ title() }}</h3>
        }
        @if (subtitle()) {
          <p class="sa-chart__subtitle">{{ subtitle() }}</p>
        }
      </div>
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartToolbarComponent {
  readonly title = input<string | undefined>(undefined);
  readonly subtitle = input<string | undefined>(undefined);
}
