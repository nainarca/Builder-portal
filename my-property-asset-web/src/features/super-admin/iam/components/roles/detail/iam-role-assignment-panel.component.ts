import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ContentSectionComponent, SectionHeaderComponent } from '@shared/ui';

import { RoleAssignmentRecord } from '../../../models/role-admin.model';

@Component({
  selector: 'app-iam-role-assignment-panel',
  imports: [DatePipe, RouterLink, ContentSectionComponent, SectionHeaderComponent],
  template: `
    <app-content-section>
      <app-section-header title="Role assignments" description="Users assigned to this role" />
      <ul class="iam-role-assignments">
        @for (a of assignments(); track a.id) {
          <li>
            <div>
              <a [routerLink]="['/super-admin/iam/users', a.userId]"><strong>{{ a.userName }}</strong></a>
              <p>{{ a.userEmail }}</p>
            </div>
            <small>{{ a.assignedAt | date: 'mediumDate' }}</small>
          </li>
        } @empty { <li>No users assigned to this role.</li> }
      </ul>
    </app-content-section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IamRoleAssignmentPanelComponent {
  readonly assignments = input.required<readonly RoleAssignmentRecord[]>();
}
