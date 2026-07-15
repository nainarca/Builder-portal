import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Owner, OwnerAssignment } from '../../models/owner.model';

@Component({
  selector: 'app-owner-overview',
  imports: [RouterLink, DatePipe],
  template: `
    <div class="owner-overview">
      <div class="owner-overview__grid">
        <div class="owner-info-panel">
          <h3 class="owner-info-panel__title">Contact information</h3>
          <dl class="owner-info-panel__list">
            @for (item of contactItems(); track item.label) {
              <div class="owner-info-panel__row">
                <dt>{{ item.label }}</dt>
                <dd>{{ item.value }}</dd>
              </div>
            }
          </dl>
        </div>

        <div class="owner-info-panel">
          <h3 class="owner-info-panel__title">Assigned unit</h3>
          @if (assignment(); as a) {
            <dl class="owner-info-panel__list">
              <div class="owner-info-panel__row"><dt>Project</dt><dd>{{ a.projectName }}</dd></div>
              <div class="owner-info-panel__row"><dt>Tower</dt><dd>{{ a.towerName }}</dd></div>
              <div class="owner-info-panel__row">
                <dt>Unit</dt>
                <dd>
                  <a [routerLink]="['/builder-portal/projects', a.projectId, 'units', a.unitId]">{{ a.unitNumber }}</a>
                </dd>
              </div>
              <div class="owner-info-panel__row"><dt>Assigned on</dt><dd>{{ a.assignedAt | date: 'mediumDate' }}</dd></div>
            </dl>
          } @else {
            <p class="mpa-body-md m-0">No unit currently assigned.</p>
          }
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerOverviewComponent {
  readonly owner = input.required<Owner>();
  readonly assignment = input<OwnerAssignment | undefined>(undefined);

  readonly contactItems = computed(() => {
    const o = this.owner();
    return [
      { label: 'Email', value: o.email },
      { label: 'Phone', value: o.phone },
      { label: 'City', value: o.city || '—' },
      { label: 'State', value: o.state || '—' },
      { label: 'Country', value: o.country || '—' },
    ];
  });
}
