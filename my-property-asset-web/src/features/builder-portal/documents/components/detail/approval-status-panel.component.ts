import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { ButtonComponent } from '@shared/ui';

import { DocumentRecord } from '../../models/document.model';
import { ApprovalBadgeComponent } from '../shared/approval-badge.component';

@Component({
  selector: 'app-approval-status-panel',
  imports: [DatePipe, ButtonComponent, ApprovalBadgeComponent],
  template: `
    <section class="doc-info-panel" aria-label="Approval status">
      <div class="doc-info-panel__header">
        <h3 class="doc-info-panel__title">Approval status</h3>
        <app-approval-badge [status]="document().approvalStatus" />
      </div>

      <div class="approval-panel__actions">
        @if (document().approvalStatus === 'draft') {
          <app-button label="Submit for review" icon="pi pi-send" (clicked)="submitForReview.emit()" />
        }
        @if (document().approvalStatus === 'pending-review') {
          <app-button label="Approve" icon="pi pi-check" (clicked)="approve.emit()" />
          <app-button label="Reject" icon="pi pi-times" severity="danger" [outlined]="true" (clicked)="rejectRequested.emit()" />
        }
      </div>

      @if (document().approvalTimeline.length > 0) {
        <ul class="approval-panel__timeline">
          @for (step of document().approvalTimeline; track step.id) {
            <li class="approval-panel__step">
              <strong>{{ step.reviewerName }}</strong> {{ step.decision === 'approved' ? 'approved' : 'rejected' }} this document
              on {{ step.actedAt | date: 'medium' }}
              @if (step.comment) {
                <p class="approval-panel__comment">{{ step.comment }}</p>
              }
            </li>
          }
        </ul>
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApprovalStatusPanelComponent {
  readonly document = input.required<DocumentRecord>();

  readonly submitForReview = output<void>();
  readonly approve = output<void>();
  readonly rejectRequested = output<void>();
}
