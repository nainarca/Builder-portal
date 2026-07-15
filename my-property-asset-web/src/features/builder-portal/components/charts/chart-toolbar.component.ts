import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-bp-chart-toolbar',
  template: `
    <div class="bp-chart__header">
      <div>
        @if (title()) {
          <h3 class="bp-chart__title">{{ title() }}</h3>
        }
        @if (subtitle()) {
          <p class="bp-chart__subtitle">{{ subtitle() }}</p>
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
