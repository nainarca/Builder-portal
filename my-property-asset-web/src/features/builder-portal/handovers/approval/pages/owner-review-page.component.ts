import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

import { BasePageComponent, ButtonComponent, UiToastService } from '@shared/ui';

import { HandoverStoreService } from '../../services/handover-store.service';
import { OwnerReviewSummaryComponent, TermsAcceptancePanelComponent } from '../components/review';
import { ApprovalEmptyStateComponent, ApprovalStatusBadgeComponent } from '../components/shared';
import { ApprovalCardComponent } from '../components/workflow';
import { ApprovalStoreService } from '../services/approval-store.service';

@Component({
  selector: 'app-owner-review-page',
  imports: [
    BasePageComponent,
    ButtonComponent,
    ApprovalStatusBadgeComponent,
    ApprovalCardComponent,
    OwnerReviewSummaryComponent,
    TermsAcceptancePanelComponent,
    ApprovalEmptyStateComponent,
  ],
  templateUrl: './owner-review-page.component.html',
  styleUrl: './owner-review-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerReviewPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly handoverStore = inject(HandoverStoreService);
  private readonly approvalStore = inject(ApprovalStoreService);
  private readonly toast = inject(UiToastService);

  private readonly handoverId = toSignal(this.route.paramMap.pipe(map((p) => p.get('id') ?? '')), {
    initialValue: '',
  });

  readonly handover = computed(() => this.handoverStore.getById(this.handoverId()));
  readonly approval = computed(() => this.approvalStore.getByHandoverId(this.handoverId()));

  backToApproval(): void {
    this.router.navigate(['/builder-portal/handovers', this.handoverId(), 'approval']);
  }

  onAccept(): void {
    this.approvalStore.acceptTerms(this.handoverId());
    this.toast.success('Terms accepted', 'Proceeding to signature.');
    this.router.navigate(['/builder-portal/handovers', this.handoverId(), 'signature']);
  }
}
