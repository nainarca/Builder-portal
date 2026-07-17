import { BuilderPortalPageComponent } from '../../../components/layout';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

import { ButtonComponent, EmptyNoDataComponent, SuccessStateComponent, UiDialogService, UiToastService } from '@shared/ui';

import { KpiCardComponent } from '../../../components/cards';
import { DashboardKpiItem } from '../../../models/dashboard.model';
import { InspectionChecklistSummaryPanelComponent } from '../../approval/components/review';
import { ApprovalStoreService } from '../../approval/services/approval-store.service';
import { DocumentSummaryPanelComponent, HandoverOverviewComponent } from '../../components/detail';
import { WorkflowCardComponent } from '../../components/shared';
import { TimelineCardComponent, WorkflowTimelineComponent } from '../../components/workflow';
import { InspectionStoreService } from '../../inspection/services/inspection-store.service';
import { HandoverStoreService } from '../../services/handover-store.service';
import { OwnerPackageCardComponent } from '../components/package';
import { CompletionEmptyStateComponent, CompletionStatusBadgeComponent } from '../components/shared';
import { AcceptanceSummaryPanelComponent, CompletionSummaryCardComponent, FutureIntegrationsPanelComponent } from '../components/summary';
import { CompletionStoreService } from '../services/completion-store.service';
import { deriveCompletionStatus } from '../services/completion.util';

@Component({
  selector: 'app-completion-workspace-page',
  imports: [ BuilderPortalPageComponent,
    ButtonComponent,
    EmptyNoDataComponent,
    SuccessStateComponent,
    KpiCardComponent,
    WorkflowCardComponent,
    TimelineCardComponent,
    WorkflowTimelineComponent,
    HandoverOverviewComponent,
    DocumentSummaryPanelComponent,
    InspectionChecklistSummaryPanelComponent,
    AcceptanceSummaryPanelComponent,
    CompletionStatusBadgeComponent,
    CompletionSummaryCardComponent,
    OwnerPackageCardComponent,
    FutureIntegrationsPanelComponent,
    CompletionEmptyStateComponent,
  ],
  templateUrl: './completion-workspace-page.component.html',
  styleUrl: './completion-workspace-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush })
export class CompletionWorkspacePageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly handoverStore = inject(HandoverStoreService);
  private readonly approvalStore = inject(ApprovalStoreService);
  private readonly inspectionStore = inject(InspectionStoreService);
  private readonly completionStore = inject(CompletionStoreService);
  private readonly dialog = inject(UiDialogService);
  private readonly toast = inject(UiToastService);

  private readonly handoverId = toSignal(this.route.paramMap.pipe(map((p) => p.get('id') ?? '')), {
    initialValue: '' });

  readonly handover = computed(() => this.handoverStore.getById(this.handoverId()));
  readonly approval = computed(() => this.approvalStore.getByHandoverId(this.handoverId()));
  readonly completion = computed(() => this.completionStore.getByHandoverId(this.handoverId()));

  readonly status = computed(() => deriveCompletionStatus(this.approval()?.status, this.completion()?.completedAt));

  readonly kpis = computed<readonly DashboardKpiItem[]>(() => {
    const handover = this.handover();
    const completion = this.completion();
    if (!handover || !completion) {
      return [];
    }
    const docs = this.inspectionStore.getByHandoverId(handover.id);
    const keysHandedOver = completion.keysAssets.filter((k) => k.handedOver).length;
    return [
      { id: 'inspection', label: 'Inspection categories complete', value: `${docs.filter((d) => d.completionPercent === 100).length}/${docs.length}`, icon: 'pi pi-check-square', tone: 'primary' },
      { id: 'keys', label: 'Keys & assets handed over', value: `${keysHandedOver}/${completion.keysAssets.length}`, icon: 'pi pi-key', tone: keysHandedOver === completion.keysAssets.length ? 'success' : 'warning' },
      { id: 'certificate', label: 'Certificate status', value: completion.certificate.status === 'generated' ? 'Generated' : 'Not generated', icon: 'pi pi-verified', tone: completion.certificate.status === 'generated' ? 'success' : 'neutral' },
      { id: 'completed-on', label: 'Completed on', value: completion.completedAt ? new Date(completion.completedAt).toLocaleDateString() : 'Not yet', icon: 'pi pi-calendar-check', tone: completion.completedAt ? 'success' : 'neutral' },
    ];
  });

  backToHandover(): void {
    this.router.navigate(['/builder-portal/handovers', this.handoverId()]);
  }

  goToApproval(): void {
    this.router.navigate(['/builder-portal/handovers', this.handoverId(), 'approval']);
  }

  goToCertificate(): void {
    this.router.navigate(['/builder-portal/handovers', this.handoverId(), 'certificate']);
  }

  goToArchive(): void {
    this.router.navigate(['/builder-portal/handovers', this.handoverId(), 'archive']);
  }

  async onFinalize(): Promise<void> {
    const confirmed = await this.dialog.confirm({
      title: 'Finalize handover completion',
      message: 'This marks builder responsibility as completed and owner possession as started. This action cannot be undone.',
      acceptLabel: 'Finalize',
      acceptSeverity: 'success' });
    if (!confirmed) {
      return;
    }
    this.completionStore.finalizeCompletion(this.handoverId(), 'Builder Admin');
    this.toast.success('Handover completed', 'Builder responsibility completed; owner possession has started.');
  }
}
