import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import {
  EmptyNoDataComponent,
  EmptyNoSearchResultsComponent,
  EmptyPermissionDeniedComponent,
} from '../empty-states/enterprise-empty-states.component';
import { ErrorAlertComponent } from '../alerts/enterprise-alerts.component';
import type { EnterpriseTableEmptyVariant } from './models/enterprise-table.models';

/** P0.1 §6.8 — table-scoped empty states; toolbar/filters remain visible. */
@Component({
  selector: 'app-enterprise-table-empty',
  imports: [
    EmptyNoDataComponent,
    EmptyNoSearchResultsComponent,
    EmptyPermissionDeniedComponent,
    ErrorAlertComponent,
  ],
  template: `
    <div
      class="enterprise-table-empty"
      role="status"
      aria-live="polite"
      [attr.aria-label]="ariaLabel()"
    >
      @switch (variant()) {
        @case ('no-data') {
          <app-empty-no-data
            [title]="title() ?? 'No data'"
            [description]="description()"
            [actionLabel]="actionLabel()"
            (action)="action.emit($event)"
          />
        }
        @case ('no-search-results') {
          <app-empty-no-search-results
            [title]="title() ?? 'No search results'"
            [description]="description()"
            [actionLabel]="actionLabel() ?? 'Clear search'"
            (action)="action.emit($event)"
          />
        }
        @case ('no-filter-results') {
          <app-empty-no-search-results
            [title]="title() || 'No matching records'"
            [description]="description() || 'Try adjusting or clearing your filters.'"
            [actionLabel]="actionLabel() ?? 'Clear filters'"
            (action)="action.emit($event)"
          />
        }
        @case ('permission-denied') {
          <app-empty-permission-denied
            [title]="title() ?? 'Permission denied'"
            [description]="description()"
            [actionLabel]="actionLabel()"
            (action)="action.emit($event)"
          />
        }
        @case ('error') {
          <app-error-alert [message]="description() || errorMessage() || title() || 'Unable to load data'" />
        }
      }
    </div>
  `,
  styles: `
    .enterprise-table-empty {
      display: flex;
      justify-content: center;
      padding: var(--mpa-spacing-xl) var(--mpa-spacing-md);
      min-height: 12rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseTableEmptyComponent {
  readonly variant = input<EnterpriseTableEmptyVariant>('no-data');
  readonly title = input<string | undefined>(undefined);
  readonly description = input<string | undefined>(undefined);
  readonly actionLabel = input<string | undefined>(undefined);
  readonly errorMessage = input<string | undefined>(undefined);
  readonly ariaLabel = input('Table empty state');

  readonly action = output<MouseEvent>();
}
