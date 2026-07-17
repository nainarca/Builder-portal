import { BuilderPortalPageComponent } from '../../../components/layout';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

import { ButtonComponent, EmptyNoDataComponent, ModalShellComponent, TextareaComponent, UiDialogService, UiToastService } from '@shared/ui';

import { KpiCardComponent } from '../../../components/cards';
import { DashboardKpiItem } from '../../../models/dashboard.model';
import { WorkflowCardComponent } from '../../components/shared';
import { TimelineCardComponent } from '../../components/workflow';
import { HandoverStoreService } from '../../services/handover-store.service';
import { AcceptanceCardComponent } from '../components/review';
import { ApprovalEmptyStateComponent, ApprovalStatusBadgeComponent } from '../components/shared';
import { ApprovalWorkflowTimelineComponent } from '../components/workflow';
import { ApprovalStatus } from '../models/approval.model';
import { ApprovalStoreService } from '../services/approval-store.service';

@Component({
  selector: 'app-approval-workspace-page',
  imports: [ BuilderPortalPageComponent,
    ButtonComponent,
    EmptyNoDataComponent,
    ModalShellComponent,
    TextareaComponent,
    KpiCardComponent,
    WorkflowCardComponent,
    TimelineCardComponent,
    ApprovalStatusBadgeComponent,
    ApprovalWorkflowTimelineComponent,
    AcceptanceCardComponent,
    ApprovalEmptyStateComponent,
  ],
  templateUrl: './approval-workspace-page.component.html',
  styleUrl: './approval-workspace-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush })
export class ApprovalWorkspacePageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly handoverStore = inject(HandoverStoreService);
  private readonly approvalStore = inject(ApprovalStoreService);
  private readonly dialog = inject(UiDialogService);
  private readonly toast = inject(UiToastService);

  private readonly handoverId = toSignal(this.route.paramMap.pipe(map((p) => p.get('id') ?? '')), {
    initialValue: '' });

  readonly handover = computed(() => this.handoverStore.getById(this.handoverId()));
  readonly approval = computed(() => this.approvalStore.getByHandoverId(this.handoverId()));

  readonly kpis = computed<readonly DashboardKpiItem[]>(() => {
    const approval = this.approval();
    if (!approval) {
      return [];
    }
    const signedCount = approval.signatures.filter(
      (s) => (s.party === 'owner' || s.party === 'builder') && s.status === 'signed',
    ).length;
    const awaiting =
      approval.status === 'ready-for-signature'
        ? 'Owner & builder'
        : approval.status === 'owner-signed'
          ? 'Builder'
          : approval.status === 'builder-signed'
            ? 'Owner'
            : approval.status === 'pending-approval'
              ? 'Builder decision'
              : 'None';

    return [
      { id: 'status', label: 'Approval status', value: this.statusLabel(approval.status), icon: 'pi pi-verified', tone: 'primary' },
      { id: 'awaiting', label: 'Awaiting', value: awaiting, icon: 'pi pi-hourglass', tone: 'info' },
      { id: 'signatures', label: 'Signatures collected', value: `${signedCount}/2`, icon: 'pi pi-pencil', tone: signedCount === 2 ? 'success' : 'warning' },
      { id: 'terms', label: 'Terms accepted', value: approval.termsAccepted ? 'Yes' : 'No', icon: 'pi pi-file-check', tone: approval.termsAccepted ? 'success' : 'neutral' },
    ];
  });

  readonly rejectModalVisible = signal(false);
  readonly rejectReason = signal('');

  goToReview(): void {
    this.router.navigate(['/builder-portal/handovers', this.handoverId(), 'review']);
  }

  goToSignature(): void {
    this.router.navigate(['/builder-portal/handovers', this.handoverId(), 'signature']);
  }

  goToCompletion(): void {
    this.router.navigate(['/builder-portal/handovers', this.handoverId(), 'completion']);
  }

  backToHandover(): void {
    this.router.navigate(['/builder-portal/handovers', this.handoverId()]);
  }

  async onApprove(): Promise<void> {
    const confirmed = await this.dialog.confirm({
      title: 'Approve handover',
      message: 'Approve this handover? This marks the owner-acceptance stage complete.',
      acceptLabel: 'Approve',
      acceptSeverity: 'success' });
    if (!confirmed) {
      return;
    }
    this.approvalStore.decide(this.handoverId(), 'approved', 'Builder Admin');
    this.toast.success('Handover approved', 'The owner-acceptance stage has been marked complete.');
  }

  async onCancel(): Promise<void> {
    const confirmed = await this.dialog.confirm({
      title: 'Cancel approval',
      message: 'Cancel this handover approval workflow?',
      acceptLabel: 'Cancel approval',
      acceptSeverity: 'danger' });
    if (!confirmed) {
      return;
    }
    this.approvalStore.decide(this.handoverId(), 'cancelled', 'Builder Admin');
    this.toast.info('Approval cancelled', 'The handover approval workflow was cancelled.');
  }

  openRejectModal(): void {
    this.rejectReason.set('');
    this.rejectModalVisible.set(true);
  }

  closeRejectModal(): void {
    this.rejectModalVisible.set(false);
  }

  confirmReject(): void {
    if (!this.rejectReason().trim()) {
      return;
    }
    this.approvalStore.decide(this.handoverId(), 'rejected', 'Builder Admin', this.rejectReason().trim());
    this.rejectModalVisible.set(false);
    this.toast.warn('Handover rejected', 'The owner-acceptance stage has been marked delayed.');
  }

  onNotesChange(notes: string): void {
    this.approvalStore.updateReviewNotes(this.handoverId(), notes);
  }

  private statusLabel(status: ApprovalStatus): string {
    const map: Record<ApprovalStatus, string> = {
      'ready-for-signature': 'Ready for signature',
      'owner-signed': 'Owner signed',
      'builder-signed': 'Builder signed',
      'pending-approval': 'Pending approval',
      approved: 'Approved',
      rejected: 'Rejected',
      cancelled: 'Cancelled' };
    return map[status];
  }
}
