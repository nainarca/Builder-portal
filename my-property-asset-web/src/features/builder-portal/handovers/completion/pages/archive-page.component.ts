import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

import { BasePageComponent, ButtonComponent } from '@shared/ui';

import { HandoverActivityItem } from '../../models/handover.model';
import { TimelineCardComponent } from '../../components/workflow';
import { ApprovalStoreService } from '../../approval/services/approval-store.service';
import { HandoverStoreService } from '../../services/handover-store.service';
import { ArchiveSummaryCardComponent } from '../components/archive';
import { CompletionStoreService } from '../services/completion-store.service';

@Component({
  selector: 'app-archive-page',
  imports: [BasePageComponent, ButtonComponent, TimelineCardComponent, ArchiveSummaryCardComponent],
  templateUrl: './archive-page.component.html',
  styleUrl: './archive-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArchivePageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly handoverStore = inject(HandoverStoreService);
  private readonly approvalStore = inject(ApprovalStoreService);
  private readonly completionStore = inject(CompletionStoreService);

  private readonly handoverId = toSignal(this.route.paramMap.pipe(map((p) => p.get('id') ?? '')), {
    initialValue: '',
  });

  readonly handover = computed(() => this.handoverStore.getById(this.handoverId()));
  readonly completion = computed(() => this.completionStore.getByHandoverId(this.handoverId()));

  readonly mergedAuditTrail = computed<readonly HandoverActivityItem[]>(() => {
    const handover = this.handover();
    const approval = this.approvalStore.getByHandoverId(this.handoverId());
    const completion = this.completion();
    if (!handover) {
      return [];
    }
    return [...handover.activity, ...(approval?.activity ?? []), ...(completion?.activity ?? [])].sort((a, b) =>
      b.timestamp.localeCompare(a.timestamp),
    );
  });

  backToCompletion(): void {
    this.router.navigate(['/builder-portal/handovers', this.handoverId(), 'completion']);
  }
}
