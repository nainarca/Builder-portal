import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

import { BasePageComponent, ButtonComponent } from '@shared/ui';

import { KpiCardComponent } from '../../../components/cards';
import { DashboardKpiItem } from '../../../models/dashboard.model';
import { HandoverActivityItem } from '../../models/handover.model';
import { TimelineCardComponent } from '../../components/workflow';
import { HandoverStoreService } from '../../services/handover-store.service';
import { InspectionCategoryGridComponent, ReadinessCardComponent } from '../components/overview';
import { InspectionStoreService } from '../services/inspection-store.service';
import { ReadinessService } from '../services/readiness.service';

@Component({
  selector: 'app-inspection-overview-page',
  imports: [
    BasePageComponent,
    ButtonComponent,
    KpiCardComponent,
    TimelineCardComponent,
    ReadinessCardComponent,
    InspectionCategoryGridComponent,
  ],
  templateUrl: './inspection-overview-page.component.html',
  styleUrl: './inspection-overview-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InspectionOverviewPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly handoverStore = inject(HandoverStoreService);
  private readonly inspectionStore = inject(InspectionStoreService);
  private readonly readinessService = inject(ReadinessService);

  private readonly handoverId = toSignal(this.route.paramMap.pipe(map((p) => p.get('id') ?? '')), {
    initialValue: '',
  });

  readonly handover = computed(() => this.handoverStore.getById(this.handoverId()));
  readonly inspections = computed(() => this.inspectionStore.getByHandoverId(this.handoverId()));
  readonly readiness = computed(() => this.readinessService.getReadiness(this.handoverId()));

  readonly kpis = computed<readonly DashboardKpiItem[]>(() => {
    const inspections = this.inspections();
    const completedCount = inspections.filter((i) => i.completionPercent === 100).length;
    const mandatoryPending = inspections
      .flatMap((i) => i.sections.flatMap((s) => s.items))
      .filter((item) => item.mandatory && item.status !== 'passed' && item.status !== 'not-applicable').length;
    const overallPercent = inspections.length
      ? Math.round(inspections.reduce((sum, i) => sum + i.completionPercent, 0) / inspections.length)
      : 0;
    const readinessLabel = this.readiness()?.overallReadiness === 'ready' ? 'Ready' : 'Not ready';

    return [
      { id: 'categories', label: 'Categories completed', value: `${completedCount}/${inspections.length}`, icon: 'pi pi-check-square', tone: 'primary' },
      { id: 'mandatory-pending', label: 'Mandatory items pending', value: String(mandatoryPending), icon: 'pi pi-exclamation-circle', tone: mandatoryPending > 0 ? 'warning' : 'success' },
      { id: 'overall-completion', label: 'Overall completion', value: `${overallPercent}%`, icon: 'pi pi-percentage', tone: 'info' },
      { id: 'readiness', label: 'Handover readiness', value: readinessLabel, icon: 'pi pi-flag', tone: readinessLabel === 'Ready' ? 'success' : 'neutral' },
    ];
  });

  readonly recentActivity = computed<readonly HandoverActivityItem[]>(() =>
    [...this.inspections()]
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .map((i) => ({
        id: i.id,
        title: `${i.title} updated`,
        description: `${i.completionPercent}% complete — ${i.result.replace(/-/g, ' ')}`,
        timestamp: i.updatedAt,
        icon: 'pi pi-check-square',
        tone: i.result === 'failed' || i.result === 'blocked' ? 'danger' : i.result === 'passed-with-remarks' ? 'warning' : 'info',
      })),
  );

  openChecklist(handoverId: string): void {
    this.router.navigate(['/builder-portal/handovers', handoverId, 'checklist']);
  }

  backToHandover(handoverId: string): void {
    this.router.navigate(['/builder-portal/handovers', handoverId]);
  }
}
