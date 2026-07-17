import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { EmptyNoActivityComponent, EmptyNoDataComponent } from '../empty-states/enterprise-empty-states.component';
import type { EnterpriseDetailEmptyVariant } from './models/enterprise-detail.models';

/** Detail-scoped empty vocabulary (related / documents / activity / financial / history). */
@Component({
  selector: 'app-enterprise-detail-empty',
  imports: [EmptyNoDataComponent, EmptyNoActivityComponent],
  template: `
    <div class="enterprise-detail-empty" role="status" aria-live="polite">
      @switch (variant()) {
        @case ('no-activity') {
          <app-empty-no-activity
            [title]="title() ?? 'No activity'"
            [description]="description() ?? 'Recent updates for this record will appear here.'"
            [actionLabel]="actionLabel()"
            (action)="action.emit($event)"
          />
        }
        @case ('no-documents') {
          <app-empty-no-data
            [title]="title() ?? 'No documents'"
            [description]="description() ?? 'Documents attached to this record will appear here.'"
            [actionLabel]="actionLabel()"
            (action)="action.emit($event)"
          />
        }
        @case ('no-financial') {
          <app-empty-no-data
            [title]="title() ?? 'No financial data'"
            [description]="description() ?? 'Financial summary will appear when billing data is available.'"
            [actionLabel]="actionLabel()"
            (action)="action.emit($event)"
          />
        }
        @case ('no-history') {
          <app-empty-no-data
            [title]="title() ?? 'No history'"
            [description]="description() ?? 'Status and audit history will appear here.'"
            [actionLabel]="actionLabel()"
            (action)="action.emit($event)"
          />
        }
        @default {
          <app-empty-no-data
            [title]="title() ?? 'No related records'"
            [description]="description() ?? 'Related records will appear here when available.'"
            [actionLabel]="actionLabel()"
            (action)="action.emit($event)"
          />
        }
      }
    </div>
  `,
  styles: `
    .enterprise-detail-empty {
      display: flex;
      justify-content: center;
      padding: var(--mpa-spacing-lg) var(--mpa-spacing-md);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseDetailEmptyComponent {
  readonly variant = input<EnterpriseDetailEmptyVariant>('no-related');
  readonly title = input<string | undefined>(undefined);
  readonly description = input<string | undefined>(undefined);
  readonly actionLabel = input<string | undefined>(undefined);
  readonly action = output<MouseEvent>();
}
