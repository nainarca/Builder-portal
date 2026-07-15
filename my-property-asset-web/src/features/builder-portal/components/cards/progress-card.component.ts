import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { DashboardProjectSummaryItem } from '../../models/dashboard.model';

@Component({
  selector: 'app-bp-progress-card',
  template: `
    <article class="bp-progress-card" [attr.aria-label]="item().name">
      <div class="bp-progress-card__header">
        <p class="bp-progress-card__name">{{ item().name }}</p>
        <span class="bp-progress-card__status" [class]="statusClass()">{{ statusLabel() }}</span>
      </div>
      <p class="bp-progress-card__location">{{ item().location }}</p>
      <div class="bp-progress-card__bar" role="progressbar" [attr.aria-valuenow]="item().progress"
        aria-valuemin="0" aria-valuemax="100">
        <div class="bp-progress-card__bar-fill" [style.width.%]="item().progress"></div>
      </div>
      <div class="bp-progress-card__footer">
        <span>{{ item().progress }}% complete</span>
        <span>{{ item().unitsSold }}/{{ item().unitsTotal }} units sold</span>
      </div>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressCardComponent {
  readonly item = input.required<DashboardProjectSummaryItem>();

  readonly statusClass = computed(() => `bp-progress-card__status--${this.item().status}`);

  readonly statusLabel = computed(() => {
    switch (this.item().status) {
      case 'planning':
        return 'Planning';
      case 'in-progress':
        return 'In progress';
      case 'handover':
        return 'Handover';
      case 'completed':
        return 'Completed';
    }
  });
}
