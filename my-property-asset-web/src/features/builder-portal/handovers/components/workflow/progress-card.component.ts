import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-progress-card',
  template: `
    <div class="handover-info-panel">
      <h3 class="handover-info-panel__title">{{ title() }}</h3>
      <div
        class="progress-card__bar"
        role="progressbar"
        [attr.aria-valuenow]="percent()"
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div
          class="progress-card__bar-fill"
          [class.progress-card__bar-fill--delayed]="delayed()"
          [class.progress-card__bar-fill--completed]="percent() >= 100"
          [style.width.%]="percent()"
        ></div>
      </div>
      <p class="progress-card__label">{{ percent() }}% complete</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressCardComponent {
  readonly title = input('Overall progress');
  readonly percent = input.required<number>();
  readonly delayed = input(false);
}
