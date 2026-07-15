import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { ApprovalStatus } from '../../models/approval.model';

const SEQUENCE = ['ready-for-signature', 'owner-signed', 'builder-signed', 'pending-approval'] as const;

const STEP_LABELS: Record<(typeof SEQUENCE)[number], string> = {
  'ready-for-signature': 'Ready for signature',
  'owner-signed': 'Owner signed',
  'builder-signed': 'Builder signed',
  'pending-approval': 'Pending approval',
};

const STEP_DESCRIPTIONS: Record<(typeof SEQUENCE)[number], string> = {
  'ready-for-signature': 'The owner review is available and the workflow is ready to begin.',
  'owner-signed': 'The owner has signed the handover.',
  'builder-signed': 'The builder representative has signed the handover.',
  'pending-approval': 'Both signatures are collected; awaiting the final decision.',
};

type TimelineRowStatus = 'completed' | 'in-progress' | 'delayed' | 'upcoming';

interface TimelineRow {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly status: TimelineRowStatus;
}

@Component({
  selector: 'app-approval-workflow-timeline',
  template: `
    <ol class="workflow-timeline">
      @for (row of rows(); track row.id) {
        <li class="workflow-timeline__item" [class.workflow-timeline__item--completed]="row.status === 'completed'">
          <span class="workflow-timeline__dot" [class]="'workflow-timeline__dot--' + row.status">
            @if (row.status === 'completed') {
              <i class="pi pi-check" aria-hidden="true"></i>
            } @else if (row.status === 'delayed') {
              <i class="pi pi-times" aria-hidden="true"></i>
            } @else {
              <i class="pi pi-circle-fill workflow-timeline__dot-icon" aria-hidden="true"></i>
            }
          </span>
          <div>
            <p class="workflow-timeline__title">{{ row.label }}</p>
            <p class="workflow-timeline__description">{{ row.description }}</p>
          </div>
        </li>
      }
    </ol>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApprovalWorkflowTimelineComponent {
  readonly status = input.required<ApprovalStatus>();

  readonly rows = computed<readonly TimelineRow[]>(() => {
    const status = this.status();
    const sequenceIndex = SEQUENCE.indexOf(status as (typeof SEQUENCE)[number]);
    const isTerminal = sequenceIndex === -1;
    const effectiveIndex = isTerminal ? SEQUENCE.length : sequenceIndex;

    const steps: TimelineRow[] = SEQUENCE.map((s, i) => ({
      id: s,
      label: STEP_LABELS[s],
      description: STEP_DESCRIPTIONS[s],
      status: i < effectiveIndex ? 'completed' : i === effectiveIndex && !isTerminal ? 'in-progress' : 'upcoming',
    }));

    const decision: TimelineRow =
      status === 'approved'
        ? { id: 'decision', label: 'Approved', description: 'The handover was approved.', status: 'completed' }
        : status === 'rejected'
          ? { id: 'decision', label: 'Rejected', description: 'The handover was rejected.', status: 'delayed' }
          : status === 'cancelled'
            ? { id: 'decision', label: 'Cancelled', description: 'The handover approval was cancelled.', status: 'delayed' }
            : { id: 'decision', label: 'Decision', description: 'Awaiting the builder-admin decision.', status: 'upcoming' };

    return [...steps, decision];
  });
}
