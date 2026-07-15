import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Unit } from '../../models/unit.model';
import { UnitAvatarComponent } from './unit-avatar.component';
import { UnitBadgeComponent } from './unit-badge.component';
import { UnitConstructionBadgeComponent } from './unit-construction-badge.component';
import { UnitStatusBadgeComponent } from './unit-status-badge.component';

@Component({
  selector: 'app-unit-card',
  imports: [RouterLink, UnitAvatarComponent, UnitBadgeComponent, UnitStatusBadgeComponent, UnitConstructionBadgeComponent],
  template: `
    <article class="unit-card">
      <a class="unit-card__link" [routerLink]="['/builder-portal/projects', projectId(), 'units', unit().id]">
        <div class="unit-card__header">
          <app-unit-avatar [unitNumber]="unit().unitNumber" />
          <div class="unit-card__title-group">
            <p class="unit-card__name">{{ unit().unitNumber }}</p>
            <p class="unit-card__meta">{{ unit().towerName }} · Floor {{ unit().floorNumber }}</p>
          </div>
        </div>

        <div class="unit-card__badges">
          <app-unit-badge [label]="unit().configuration" />
          <app-unit-status-badge [status]="unit().status" />
          <app-unit-construction-badge [stage]="unit().constructionStage" />
        </div>

        <div class="unit-card__bar" role="progressbar" [attr.aria-valuenow]="unit().progress" aria-valuemin="0" aria-valuemax="100">
          <div class="unit-card__bar-fill" [style.width.%]="unit().progress"></div>
        </div>

        <div class="unit-card__footer">
          <span>{{ unit().progress }}% complete</span>
          <span>{{ unit().areaSqft }} sqft</span>
        </div>
      </a>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnitCardComponent {
  readonly unit = input.required<Unit>();
  readonly projectId = input.required<string>();
}
