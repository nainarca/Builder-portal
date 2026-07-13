import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-sa-statistic-card',
  template: `
    <article class="sa-statistic-card" [attr.aria-label]="label()">
      <p class="sa-statistic-card__label">{{ label() }}</p>
      <p class="sa-statistic-card__value">{{ value() }}</p>
      @if (caption()) {
        <p class="sa-kpi-card__hint">{{ caption() }}</p>
      }
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly caption = input<string | undefined>(undefined);
}
