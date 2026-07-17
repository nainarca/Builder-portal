import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

import {
  EmptyNoDataComponent,
  EnterpriseDetailAction,
  EnterpriseDetailActionPanelComponent,
  EnterpriseDetailShellComponent,
  EnterpriseDetailStageStep,
  EnterpriseEntityHeroComponent,
  EnterpriseMetadataGridComponent,
} from '@shared/ui';

import { BuilderPortalPageComponent } from '../../components/layout';
import { DocumentSummaryPanelComponent, HandoverOverviewComponent } from '../components/detail';
import { WorkflowCardComponent } from '../components/shared';
import {
  ProgressCardComponent,
  TimelineCardComponent,
  WorkflowTimelineComponent,
} from '../components/workflow';
import { HANDOVER_STAGE_DEFINITIONS } from '../config/handovers.config';
import { ReadinessCardComponent } from '../inspection/components/overview';
import { ReadinessService } from '../inspection/services/readiness.service';
import { HandoverOverallStatus, HandoverStageStatusValue } from '../models/handover.model';
import { HandoverInvitationService } from '../services/handover-invitation.service';
import { OwnerActivationService } from '../services/owner-activation.service';
import { HandoverStoreService } from '../services/handover-store.service';

@Component({
  selector: 'app-handover-detail-page',
  imports: [
    BuilderPortalPageComponent,
    EmptyNoDataComponent,
    EnterpriseDetailShellComponent,
    EnterpriseEntityHeroComponent,
    EnterpriseMetadataGridComponent,
    EnterpriseDetailActionPanelComponent,
    WorkflowCardComponent,
    HandoverOverviewComponent,
    DocumentSummaryPanelComponent,
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
  private readonly router = inject(Router);
  private readonly store = inject(HandoverStoreService);
  private readonly readinessService = inject(ReadinessService);
  private readonly invitations = inject(HandoverInvitationService);
  private readonly activation = inject(OwnerActivationService);

  private readonly handoverId = toSignal(this.route.paramMap.pipe(map((p) => p.get('id') ?? '')), {
    initialValue: '',
  });

  readonly activeStageId = signal<string | undefined>(undefined);

  readonly handover = computed(() => this.store.getById(this.handoverId()));
  readonly readiness = computed(() => this.readinessService.getReadiness(this.handoverId()));
  readonly invitation = computed(() => this.invitations.getSummary(this.handoverId()));
  readonly activationReadiness = computed(() => this.activation.getReadiness(this.handoverId()));

  readonly stageSteps = computed<readonly EnterpriseDetailStageStep[]>(() => {
    const h = this.handover();
    if (!h) {
      return [];
    }
    return h.stages.map((stage) => {
      const def = HANDOVER_STAGE_DEFINITIONS.find((d) => d.id === stage.stageId);
      return {
        id: stage.stageId,
        label: def?.label ?? stage.stageId,
        description: def?.description,
        status: this.mapStageStatus(stage.status),
      };
    });
  });

  readonly statusLabel = computed(() => {
    const status = this.handover()?.overallStatus;
    const map: Record<HandoverOverallStatus, string> = {
      pending: 'Pending',
      'in-progress': 'In progress',
      completed: 'Completed',
      delayed: 'Delayed',
    };
    return status ? map[status] : undefined;
  });

  readonly statusSeverity = computed(() => {
    const status = this.handover()?.overallStatus;
    const map: Record<HandoverOverallStatus, 'success' | 'warn' | 'danger' | 'info' | 'secondary'> = {
      pending: 'secondary',
      'in-progress': 'info',
      completed: 'success',
      delayed: 'danger',
    };
    return status ? map[status] : 'secondary';
  });

  readonly statusIcon = computed(() => {
    const status = this.handover()?.overallStatus;
    const map: Record<HandoverOverallStatus, string> = {
      pending: 'pi pi-hourglass',
      'in-progress': 'pi pi-sync',
      completed: 'pi pi-check-circle',
      delayed: 'pi pi-exclamation-triangle',
    };
    return status ? map[status] : undefined;
  });

  readonly heroFacts = computed(() => {
    const h = this.handover();
    if (!h) {
      return [];
    }
    return [
      { label: 'Unit', value: h.unitNumber },
      { label: 'Owner', value: h.ownerName },
    ];
  });

  readonly heroStats = computed(() => {
    const h = this.handover();
    if (!h) {
      return [];
    }
    return [
      { id: 'progress', label: 'Progress', value: `${h.overallProgress}%` },
      {
        id: 'stages',
        label: 'Completed stages',
        value: String(h.stages.filter((s) => s.status === 'completed').length),
      },
    ];
  });

  readonly stageWorkspaceActions = computed<readonly EnterpriseDetailAction[]>(() => [
    { id: 'documents', label: 'Documents', icon: 'pi pi-folder' },
    { id: 'invitation', label: 'Invitation', icon: 'pi pi-send' },
    { id: 'activation', label: 'Activation', icon: 'pi pi-user-plus' },
    { id: 'inspection', label: 'Inspection & checklist', icon: 'pi pi-check-square' },
    { id: 'approval', label: 'Approval & signature', icon: 'pi pi-pencil' },
    { id: 'completion', label: 'Completion', icon: 'pi pi-flag' },
  ]);

  readonly overflowActions = computed<readonly EnterpriseDetailAction[]>(() => [
    { id: 'back', label: 'Back to handovers', icon: 'pi pi-arrow-left' },
    ...this.stageWorkspaceActions(),
  ]);

  onStageSelect(stageId: string): void {
    this.activeStageId.set(stageId);
  }

  onOverflowAction(actionId: string): void {
    const id = this.handoverId();
    if (actionId === 'back') {
      void this.router.navigate(['/builder-portal/handovers']);
      return;
    }
    const routes: Record<string, string> = {
      documents: 'documents',
      invitation: 'invitation',
      activation: 'activation',
      inspection: 'inspection',
      approval: 'approval',
      completion: 'completion',
    };
    const segment = routes[actionId];
    if (segment) {
      void this.router.navigate(['/builder-portal/handovers', id, segment]);
    }
  }

  private mapStageStatus(
    status: HandoverStageStatusValue,
  ): EnterpriseDetailStageStep['status'] {
    switch (status) {
      case 'completed':
        return 'completed';
      case 'in-progress':
        return 'in-progress';
      case 'delayed':
        return 'delayed';
      case 'upcoming':
      default:
        return 'pending';
    }
  }
}
