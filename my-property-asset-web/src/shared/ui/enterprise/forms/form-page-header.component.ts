import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { PageHeaderComponent } from '../../composites/page/page-header.component';
import { StatusBadgeComponent } from '../../composites/notification/status-badge.component';
import { EnterpriseFormMode } from './models/enterprise-form.models';

/**
 * DS-04 Form Page Header — title, subtitle, status, breadcrumb slot, actions (P0.1 §5.1).
 */
@Component({
  selector: 'app-enterprise-form-page-header',
  imports: [PageHeaderComponent, StatusBadgeComponent],
  template: `
    <div class="enterprise-form-page-header">
      <div class="enterprise-form-page-header__breadcrumb">
        <ng-content select="[formBreadcrumb]" />
      </div>

      <app-page-header
        [title]="title()"
        [description]="subtitle()"
        [eyebrow]="eyebrow() || modeLabel()"
      >
        <div pageActions class="enterprise-form-page-header__aside">
          @if (statusLabel()) {
            <app-status-badge
              [label]="statusLabel()!"
              [severity]="statusSeverity()"
              [icon]="statusIcon()"
            />
          }
          <ng-content select="[formHeaderActions]" />
        </div>
        <div pageToolbar>
          <ng-content select="[formHeaderToolbar]" />
        </div>
      </app-page-header>
    </div>
  `,
  styles: `
    .enterprise-form-page-header {
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-sm);
      margin-bottom: var(--mpa-spacing-lg);
    }
    .enterprise-form-page-header__breadcrumb:empty {
      display: none;
    }
    .enterprise-form-page-header__aside {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--mpa-spacing-sm);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseFormPageHeaderComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string | undefined>(undefined);
  readonly eyebrow = input<string | undefined>(undefined);
  readonly mode = input<EnterpriseFormMode>('edit');
  readonly statusLabel = input<string | undefined>(undefined);
  readonly statusSeverity = input<'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'>(
    'secondary',
  );
  readonly statusIcon = input<string | undefined>(undefined);

  modeLabel(): string {
    switch (this.mode()) {
      case 'create':
        return 'Create';
      case 'view':
        return 'View';
      default:
        return 'Edit';
    }
  }
}
