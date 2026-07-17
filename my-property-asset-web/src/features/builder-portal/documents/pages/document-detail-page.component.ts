import { BuilderPortalPageComponent } from '../../components/layout';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

import {
  ButtonComponent,
  EmptyNoDataComponent,
  InputTextComponent,
  ModalShellComponent,
  UiDialogService,
  UiToastService,
} from '@shared/ui';

import { OwnerStoreService } from '../../owners/services/owner-store.service';
import {
  ApprovalStatusPanelComponent,
  DocumentOverviewComponent,
  DocumentTimelineComponent,
  DownloadPlaceholderComponent,
  OwnerVisibilityPanelComponent,
  PreviewPlaceholderComponent } from '../components/detail';
import { DocumentHeaderComponent } from '../components/shared';
import { DocumentStoreService } from '../services/document-store.service';

@Component({
  selector: 'app-document-detail-page',
  imports: [
    BuilderPortalPageComponent,
    EmptyNoDataComponent,
    ButtonComponent,
    InputTextComponent,
    ModalShellComponent,
    DocumentHeaderComponent,
    DocumentOverviewComponent,
    ApprovalStatusPanelComponent,
    DocumentTimelineComponent,
    OwnerVisibilityPanelComponent,
    DownloadPlaceholderComponent,
    PreviewPlaceholderComponent,
  ],
  templateUrl: './document-detail-page.component.html',
  styleUrl: './document-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush })
export class DocumentDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(DocumentStoreService);
  private readonly ownerStore = inject(OwnerStoreService);
  private readonly dialog = inject(UiDialogService);
  private readonly toast = inject(UiToastService);

  private readonly documentId = toSignal(this.route.paramMap.pipe(map((p) => p.get('id') ?? '')), {
    initialValue: '' });

  readonly document = computed(() => this.store.getById(this.documentId()));

  readonly assignedOwner = computed(() => {
    const doc = this.document();
    if (!doc?.unitId) {
      return undefined;
    }
    const assignment = this.ownerStore.getAssignmentByUnitId(doc.unitId);
    return assignment ? { id: assignment.ownerId, name: assignment.ownerName } : undefined;
  });

  readonly rejectModalVisible = signal(false);
  readonly rejectComment = signal('');

  async onArchive(): Promise<void> {
    const doc = this.document();
    if (!doc) {
      return;
    }
    const confirmed = await this.dialog.confirm({
      title: 'Archive document',
      message: `Archive "${doc.name}"? It will be hidden from the default explorer view until restored.`,
      acceptLabel: 'Archive',
      acceptSeverity: 'danger' });
    if (!confirmed) {
      return;
    }
    this.store.archive(doc.id);
    this.toast.success('Document archived', `${doc.name} has been archived.`);
  }

  async onRestore(): Promise<void> {
    const doc = this.document();
    if (!doc) {
      return;
    }
    const confirmed = await this.dialog.confirm({
      title: 'Restore document',
      message: `Restore "${doc.name}" to the active explorer?`,
      acceptLabel: 'Restore' });
    if (!confirmed) {
      return;
    }
    this.store.restore(doc.id);
    this.toast.success('Document restored', `${doc.name} is active again.`);
  }

  onSubmitForReview(): void {
    const doc = this.document();
    if (!doc) {
      return;
    }
    this.store.submitForReview(doc.id);
    this.toast.info('Submitted for review', `${doc.name} is now pending review.`);
  }

  onApprove(): void {
    const doc = this.document();
    if (!doc) {
      return;
    }
    this.store.approve(doc.id);
    this.toast.success('Document approved', `${doc.name} has been approved.`);
  }

  openRejectModal(): void {
    this.rejectComment.set('');
    this.rejectModalVisible.set(true);
  }

  closeRejectModal(): void {
    this.rejectModalVisible.set(false);
  }

  confirmReject(): void {
    const doc = this.document();
    if (!doc || !this.rejectComment().trim()) {
      return;
    }
    this.store.reject(doc.id, this.rejectComment().trim());
    this.rejectModalVisible.set(false);
    this.toast.info('Document rejected', `${doc.name} was returned with comments.`);
  }
}
