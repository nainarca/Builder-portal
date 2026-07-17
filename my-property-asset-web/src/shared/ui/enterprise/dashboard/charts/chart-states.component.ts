import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { EmptyStateComponent } from '../../../composites/feedback/empty-state.component';
import { EnterpriseSpinnerComponent } from '../../loading/enterprise-loading.component';

@Component({
  selector: 'app-enterprise-chart-empty',
  imports: [EmptyStateComponent],
  template: `
    <div class="enterprise-chart-empty" role="status" aria-live="polite">
      <app-empty-state [title]="title()" [description]="message()" icon="chart-line" />
    </div>
  `,
  styles: `
    .enterprise-chart-empty {
      display: flex; justify-content: center; align-items: center;
      min-height: 10rem; padding: var(--mpa-spacing-lg);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseChartEmptyComponent {
  readonly title = input('No chart data');
  readonly message = input('Data will appear here once metrics are connected.');
}

@Component({
  selector: 'app-enterprise-chart-loading',
  imports: [EnterpriseSpinnerComponent],
  template: `
    <div class="enterprise-chart-loading" role="status" aria-live="polite">
      <app-enterprise-spinner [ariaLabel]="label()" />
      <p>{{ label() }}</p>
    </div>
  `,
  styles: `
    .enterprise-chart-loading {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: var(--mpa-spacing-md); min-height: 10rem; color: var(--mpa-color-text-muted);
      font-size: var(--mpa-font-size-sm);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseChartLoadingComponent {
  readonly label = input('Loading chart data…');
}

@Component({
  selector: 'app-enterprise-chart-data-table',
  template: `
    @if (visible()) {
      <div class="enterprise-chart-data-table" role="region" [attr.aria-label]="ariaLabel()">
        <table>
          <thead>
            <tr>
              <th scope="col">{{ labelHeader() }}</th>
              @for (series of seriesLabels(); track series) {
                <th scope="col">{{ series }}</th>
              }
            </tr>
          </thead>
          <tbody>
            @for (row of rows(); track row.label) {
              <tr>
                <th scope="row">{{ row.label }}</th>
                @for (value of row.values; track $index) {
                  <td>{{ value }}</td>
                }
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
  `,
  styles: `
    .enterprise-chart-data-table {
      margin-top: var(--mpa-spacing-md); overflow-x: auto;
    }
    .enterprise-chart-data-table table {
      width: 100%; border-collapse: collapse; font-size: var(--mpa-font-size-sm);
    }
    .enterprise-chart-data-table th,
    .enterprise-chart-data-table td {
      padding: var(--mpa-spacing-sm); border-bottom: 1px solid var(--mpa-color-border); text-align: left;
    }
    .enterprise-chart-data-table thead th {
      background: var(--mpa-color-surface-muted); font-weight: var(--mpa-font-weight-semibold);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseChartDataTableComponent {
  readonly visible = input(false);
  readonly labelHeader = input('Category');
  readonly seriesLabels = input<readonly string[]>([]);
  readonly rows = input<readonly { label: string; values: readonly number[] }[]>([]);
  readonly ariaLabel = input('Chart data table');
}
