import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Building } from '../../models/building.model';
import { BuildingStatusBadgeComponent } from './building-status-badge.component';

@Component({
  selector: 'app-bldg-card',
  imports: [RouterLink, BuildingStatusBadgeComponent],
  template: `
    <article class="bldg-card">
      <a
        class="bldg-card__link"
        [routerLink]="['/builder-portal/projects', building().projectId, 'buildings', building().id]"
      >
        <div class="bldg-card__header">
          <div>
            <p class="bldg-card__name">{{ building().name }}</p>
            <p class="bldg-card__meta">{{ building().code }} · Order {{ building().displayOrder }}</p>
          </div>
          <app-bldg-status-badge [status]="building().status" />
        </div>
        <div class="bldg-card__stats">
          <span>{{ building().floorsCount }} floors</span>
          <span>{{ building().unitsCount }} units (planned)</span>
        </div>
      </a>
    </article>
  `,
  styles: `
    .bldg-card {
      border: 1px solid var(--mpa-color-border, #e5e7eb);
      border-radius: 0.75rem;
      overflow: hidden;
      background: var(--mpa-color-surface, #fff);
    }
    .bldg-card__link {
      display: block;
      padding: 1rem;
      color: inherit;
      text-decoration: none;
    }
    .bldg-card__header {
      display: flex;
      justify-content: space-between;
      gap: 0.75rem;
      align-items: flex-start;
    }
    .bldg-card__name {
      margin: 0;
      font-weight: 600;
    }
    .bldg-card__meta {
      margin: 0.25rem 0 0;
      opacity: 0.7;
      font-size: 0.875rem;
    }
    .bldg-card__stats {
      display: flex;
      gap: 1rem;
      margin-top: 0.75rem;
      font-size: 0.875rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuildingCardComponent {
  readonly building = input.required<Building>();
}
