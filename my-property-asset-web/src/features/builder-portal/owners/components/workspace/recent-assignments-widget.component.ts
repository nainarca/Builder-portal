import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { OwnerAssignment } from '../../models/owner.model';
import { AssignmentCardComponent } from '../shared/assignment-card.component';
import { OwnerEmptyStateComponent } from '../shared/owner-empty-state.component';

@Component({
  selector: 'app-recent-assignments-widget',
  imports: [AssignmentCardComponent, OwnerEmptyStateComponent],
  template: `
    @if (assignments().length === 0) {
      <app-owner-empty-state
        title="No recent assignments"
        subtitle="Newly assigned owners will appear here."
        [actionLabel]="undefined"
      />
    } @else {
      <div class="recent-assignments-list">
        @for (assignment of assignments(); track assignment.id) {
          <app-assignment-card [assignment]="assignment" />
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentAssignmentsWidgetComponent {
  readonly assignments = input.required<readonly OwnerAssignment[]>();
}
