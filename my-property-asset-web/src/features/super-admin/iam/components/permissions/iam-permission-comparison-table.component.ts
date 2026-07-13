import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { PermissionComparisonResult } from '../../models/permission-admin.model';
import { IamPermissionBadgeComponent } from '../shared';

@Component({
  selector: 'app-iam-permission-comparison-table',
  imports: [IamPermissionBadgeComponent],
  template: `
    <div class="iam-comparison-table">
      @for (row of items(); track row.resource) {
        @if (row.differs) {
          <div class="iam-comparison-table__row">
            <span class="iam-comparison-table__resource">{{ row.resourceLabel }}</span>
            <app-iam-permission-badge [level]="row.levelA" />
            <i class="pi pi-arrows-h" aria-hidden="true"></i>
            <app-iam-permission-badge [level]="row.levelB" />
          </div>
        }
      } @empty { <p>No differences between selected roles.</p> }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IamPermissionComparisonTableComponent {
  readonly items = input.required<readonly PermissionComparisonResult[]>();
}
