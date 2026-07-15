import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { EmptyStateComponent } from '@shared/ui';

@Component({
  selector: 'app-bp-empty-chart-state',
  imports: [EmptyStateComponent],
  template: `
    <div class="bp-chart-empty" role="status">
      <app-empty-state
        [title]="title()"
        [description]="message()"
        icon="chart-pie"
        [actionLabel]="undefined"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyChartStateComponent {
  readonly title = input('No chart data');
  readonly message = input('Data will appear here once metrics are connected.');
}
