import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface AssignmentSummaryRow {
  readonly label: string;
  readonly value: number;
  readonly color: string;
}

@Component({
  selector: 'app-assignment-summary-widget',
  template: `
    <div class="assignment-summary-widget">
      @for (row of rows(); track row.label) {
        <div class="assignment-summary-widget__row">
          <span class="assignment-summary-widget__label">
            <span class="assignment-summary-widget__dot" [style.background]="row.color"></span>
            {{ row.label }}
          </span>
          <span class="assignment-summary-widget__value">{{ row.value }}</span>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssignmentSummaryWidgetComponent {
  readonly rows = input.required<readonly AssignmentSummaryRow[]>();
}
