import { BuilderPortalPageComponent } from '../../../components/layout';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

import { ButtonComponent, EmptyNoDataComponent, UiToastService } from '@shared/ui';

import { OwnerStoreService } from '../../../owners/services/owner-store.service';
import { ApprovalStoreService } from '../../approval/services/approval-store.service';
import { HandoverStoreService } from '../../services/handover-store.service';
import { CertificatePreviewComponent, PdfDownloadPlaceholderComponent, QrVerificationPlaceholderComponent } from '../components/certificate';
import { CompletionEmptyStateComponent } from '../components/shared';
import { CompletionStoreService } from '../services/completion-store.service';

@Component({
  selector: 'app-certificate-page',
  imports: [ BuilderPortalPageComponent,
    ButtonComponent,
    EmptyNoDataComponent,
    CertificatePreviewComponent,
    QrVerificationPlaceholderComponent,
    PdfDownloadPlaceholderComponent,
    CompletionEmptyStateComponent,
  ],
  templateUrl: './certificate-page.component.html',
  styleUrl: './certificate-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush })
export class CertificatePageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly handoverStore = inject(HandoverStoreService);
  private readonly approvalStore = inject(ApprovalStoreService);
  private readonly completionStore = inject(CompletionStoreService);
  private readonly ownerStore = inject(OwnerStoreService);
  private readonly toast = inject(UiToastService);

  private readonly handoverId = toSignal(this.route.paramMap.pipe(map((p) => p.get('id') ?? '')), {
    initialValue: '' });

  readonly handover = computed(() => this.handoverStore.getById(this.handoverId()));
  readonly approval = computed(() => this.approvalStore.getByHandoverId(this.handoverId()));
  readonly completion = computed(() => this.completionStore.getByHandoverId(this.handoverId()));
  readonly owner = computed(() => {
    const h = this.handover();
    return h ? this.ownerStore.getById(h.ownerId) : undefined;
  });

  backToCompletion(): void {
    this.router.navigate(['/builder-portal/handovers', this.handoverId(), 'completion']);
  }

  onGenerateCertificate(): void {
    this.completionStore.generateCertificate(this.handoverId());
    this.toast.success('Certificate generated', 'The possession certificate has been issued.');
  }

  onPrint(): void {
    window.print();
  }
}
