import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Handover } from '../../models/handover.model';
import { HandoverStatusBadgeComponent } from './handover-status-badge.component';
import { StageBadgeComponent } from './stage-badge.component';

@Component({
  selector: 'app-handover-card',
  imports: [RouterLink, DatePipe, StageBadgeComponent, HandoverStatusBadgeComponent],
  template: `
    <article class="handover-card">
      <a class="handover-card__link" [routerLink]="['/builder-portal/handovers', handover().id]">
        <div class="handover-card__header">
          <span class="handover-icon"><i class="pi pi-flag" aria-hidden="true"></i></span>
          <div class="handover-card__title-group">
            <p class="handover-card__name">{{ handover().unitNumber }} · {{ handover().towerName }}</p>
            <p class="handover-card__meta">{{ handover().projectName }} · {{ handover().ownerName }}</p>
          </div>
        </div>

        <div class="handover-card__badges">
          <app-handover-status-badge [status]="handover().overallStatus" />
          <app-stage-badge [stageId]="currentStageId()" />
        </div>

        <div class="progress-card__bar" role="progressbar" [attr.aria-valuenow]="handover().overallProgress" aria-valuemin="0" aria-valuemax="100">
          <div
            class="progress-card__bar-fill"
            [class.progress-card__bar-fill--delayed]="handover().overallStatus === 'delayed'"
            [class.progress-card__bar-fill--completed]="handover().overallStatus === 'completed'"
            [style.width.%]="handover().overallProgress"
          ></div>
        </div>

        <div class="handover-card__footer">
          <span>{{ handover().overallProgress }}% complete</span>
          @if (handover().targetCompletionDate) {
            <span>Target: {{ handover().targetCompletionDate | date: 'mediumDate' }}</span>
          }
        </div>
      </a>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HandoverCardComponent {
  readonly handover = input.required<Handover>();

  readonly currentStageId = computed(() => {
    const stages = this.handover().stages;
    const active = stages.find((s) => s.status !== 'completed');
    return active?.stageId ?? stages[stages.length - 1].stageId;
  });
}
