import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface BuilderStatItem {
  readonly label: string;
  readonly value: string;
  readonly hint?: string;
  readonly icon?: string;
}

@Component({
  selector: 'app-bldr-statistics-cards',
  template: `
    <div class="bldr-stats" role="list">
      @for (stat of stats(); track stat.label) {
        <article class="bldr-stats__card" role="listitem">
          @if (stat.icon) { <i [class]="stat.icon" class="bldr-stats__icon" aria-hidden="true"></i> }
          <p class="bldr-stats__label">{{ stat.label }}</p>
          <p class="bldr-stats__value">{{ stat.value }}</p>
          @if (stat.hint) { <p class="bldr-stats__hint">{{ stat.hint }}</p> }
        </article>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderStatisticsCardsComponent {
  readonly stats = input.required<readonly BuilderStatItem[]>();
}
