import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';

import { BasePageComponent } from '@shared/ui';

import { DocumentSummaryPanelComponent, HandoverOverviewComponent } from '../components/detail';
import { HandoverStatusBadgeComponent, WorkflowCardComponent } from '../components/shared';
import { MilestoneTrackerComponent, ProgressCardComponent, TimelineCardComponent, WorkflowTimelineComponent } from '../components/workflow';
import { ReadinessCardComponent } from '../inspection/components/overview';
import { ReadinessService } from '../inspection/services/readiness.service';
import { HandoverStoreService } from '../services/handover-store.service';

@Component({
  selector: 'app-handover-detail-page',
  imports: [
    BasePageComponent,
    RouterLink,
    HandoverStatusBadgeComponent,
    WorkflowCardComponent,
    HandoverOverviewComponent,
    DocumentSummaryPanelComponent,
    MilestoneTrackerComponent,
    ProgressCardComponent,
    TimelineCardComponent,
    WorkflowTimelineComponent,
    ReadinessCardComponent,
  ],
  templateUrl: './handover-detail-page.component.html',
  styleUrl: './handover-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HandoverDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(HandoverStoreService);
  private readonly readinessService = inject(ReadinessService);

  private readonly handoverId = toSignal(this.route.paramMap.pipe(map((p) => p.get('id') ?? '')), {
    initialValue: '',
  });

  readonly handover = computed(() => this.store.getById(this.handoverId()));
  readonly readiness = computed(() => this.readinessService.getReadiness(this.handoverId()));
}
