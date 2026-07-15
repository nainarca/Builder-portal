import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { INSPECTION_CATEGORY_DEFINITIONS } from '../../config/inspection.config';
import { Inspection } from '../../models/inspection.model';
import { InspectionStatusBadgeComponent } from './inspection-status-badge.component';

@Component({
  selector: 'app-inspection-card',
  imports: [RouterLink, InspectionStatusBadgeComponent],
  template: `
    <article class="insp-card">
      <a
        class="insp-card__link"
        [routerLink]="['/builder-portal/handovers', inspection().handoverId, 'checklist']"
        [queryParams]="{ category: inspection().category }"
      >
        <div class="insp-card__header">
          <span class="insp-card__icon"><i [class]="icon()" aria-hidden="true"></i></span>
          <div class="insp-card__title-group">
            <p class="insp-card__title">{{ inspection().title }}</p>
            @if (inspection().mandatoryForHandover) {
              <span class="insp-card__mandatory">Mandatory for handover</span>
            }
          </div>
        </div>

        <app-inspection-status-badge [status]="inspection().result" />

        <div
          class="progress-card__bar"
          role="progressbar"
          [attr.aria-valuenow]="inspection().completionPercent"
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <div
            class="progress-card__bar-fill"
            [class.progress-card__bar-fill--delayed]="inspection().result === 'failed' || inspection().result === 'blocked'"
            [class.progress-card__bar-fill--completed]="inspection().completionPercent >= 100"
            [style.width.%]="inspection().completionPercent"
          ></div>
        </div>
        <p class="insp-card__footer">{{ inspection().completionPercent }}% complete</p>
      </a>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InspectionCardComponent {
  readonly inspection = input.required<Inspection>();

  readonly icon = computed(
    () => INSPECTION_CATEGORY_DEFINITIONS.find((d) => d.id === this.inspection().category)?.icon ?? 'pi pi-check-square',
  );
}
