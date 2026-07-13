import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SpinnerComponent } from '@shared/ui';

@Component({
  selector: 'app-sa-loading-chart-state',
  imports: [SpinnerComponent],
  template: `
    <div class="sa-chart-loading" role="status" aria-live="polite">
      <app-spinner diameter="2.5rem" ariaLabel="Loading chart" />
      <p class="sa-chart-empty__message">Loading chart data…</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingChartStateComponent {}
