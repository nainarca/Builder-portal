import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface IamStatItem {
  readonly label: string;
  readonly value: string;
  readonly icon?: string;
  readonly hint?: string;
}

@Component({
  selector: 'app-iam-statistics-cards',
  template: `
    <div class="iam-stats" role="list">
      @for (stat of stats(); track stat.label) {
        <article class="iam-stats__card" role="listitem">
          @if (stat.icon) { <i [class]="stat.icon" class="iam-stats__icon" aria-hidden="true"></i> }
          <p class="iam-stats__label">{{ stat.label }}</p>
          <p class="iam-stats__value">{{ stat.value }}</p>
          @if (stat.hint) { <p class="iam-stats__hint">{{ stat.hint }}</p> }
        </article>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IamStatisticsCardsComponent {
  readonly stats = input.required<readonly IamStatItem[]>();
}
