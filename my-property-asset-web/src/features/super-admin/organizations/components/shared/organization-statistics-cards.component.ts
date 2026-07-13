import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface OrganizationStatItem {
  readonly label: string;
  readonly value: string;
  readonly hint?: string;
  readonly icon?: string;
}

@Component({
  selector: 'app-org-statistics-cards',
  template: `
    <div class="org-stats" role="list">
      @for (stat of stats(); track stat.label) {
        <article class="org-stats__card" role="listitem">
          @if (stat.icon) {
            <i [class]="stat.icon" class="org-stats__icon" aria-hidden="true"></i>
          }
          <p class="org-stats__label">{{ stat.label }}</p>
          <p class="org-stats__value">{{ stat.value }}</p>
          @if (stat.hint) {
            <p class="org-stats__hint">{{ stat.hint }}</p>
          }
        </article>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationStatisticsCardsComponent {
  readonly stats = input.required<readonly OrganizationStatItem[]>();
}
