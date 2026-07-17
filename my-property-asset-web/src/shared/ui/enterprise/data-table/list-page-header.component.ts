import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { EnterpriseFormPageHeaderComponent } from '../forms/form-page-header.component';
import type { EnterpriseFormMode } from '../forms/models/enterprise-form.models';

/**
 * Enterprise list page header — title, description, breadcrumb slot, one primary action.
 * Presentation alias of the form page header for list contexts (UI-REBIRTH §6).
 * Exactly one primary action should be projected via [listHeaderActions].
 */
@Component({
  selector: 'app-enterprise-list-page-header',
  imports: [EnterpriseFormPageHeaderComponent],
  template: `
    <app-enterprise-form-page-header
      [title]="title()"
      [subtitle]="description()"
      [eyebrow]="eyebrow()"
      [mode]="mode()"
      [statusLabel]="statusLabel()"
      [statusSeverity]="statusSeverity()"
      [statusIcon]="statusIcon()"
    >
      <ng-content select="[listBreadcrumb]" formBreadcrumb />
      <ng-content select="[listHeaderActions]" formHeaderActions />
      <ng-content select="[listHeaderToolbar]" formHeaderToolbar />
    </app-enterprise-form-page-header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseListPageHeaderComponent {
  readonly title = input.required<string>();
  readonly description = input<string | undefined>(undefined);
  readonly eyebrow = input<string | undefined>(undefined);
  readonly mode = input<EnterpriseFormMode>('view');
  readonly statusLabel = input<string | undefined>(undefined);
  readonly statusSeverity = input<'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'>(
    'secondary',
  );
  readonly statusIcon = input<string | undefined>(undefined);
}
