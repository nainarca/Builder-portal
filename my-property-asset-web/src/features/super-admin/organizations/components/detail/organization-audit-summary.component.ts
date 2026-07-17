import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { EmptyNoDataComponent, EnterpriseSectionHeaderComponent } from '@shared/ui';

import { OrganizationAuditRecord } from '../../models/organization-admin.model';

@Component({
  selector: 'app-org-audit-summary',
  imports: [DatePipe, EnterpriseSectionHeaderComponent, EmptyNoDataComponent],
  template: `
    <section class="org-audit" aria-label="Audit summary">
      <app-enterprise-section-header
        title="Audit summary"
        description="Administrative actions on this organization"
      />

      @if (items().length) {
        <ul class="org-audit-list">
          @for (item of items(); track item.id) {
            <li class="org-audit-list__item">
              <div>
                <strong>{{ item.action }}</strong>
                <p class="org-audit-list__detail">{{ item.detail }}</p>
              </div>
              <div class="org-audit-list__meta">
                <span>{{ item.actor }}</span>
                <time>{{ item.timestamp | date: 'short' }}</time>
              </div>
            </li>
          }
        </ul>
      } @else {
        <app-empty-no-data
          title="No audit entries"
          description="Administrative actions will be recorded here."
        />
      }
    </section>
  `,
  styles: `
    .org-audit {
      display: grid;
      gap: var(--mpa-spacing-md);
    }

    .org-audit-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      gap: var(--mpa-spacing-sm);
    }

    .org-audit-list__item {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: var(--mpa-spacing-md);
      padding: var(--mpa-spacing-md);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-lg);
      background: var(--mpa-color-surface-elevated);
    }

    .org-audit-list__detail {
      margin: 0.25rem 0 0;
      font-size: var(--mpa-font-size-sm);
      color: var(--mpa-color-text-muted);
    }

    .org-audit-list__meta {
      display: grid;
      gap: 0.15rem;
      text-align: right;
      font-size: var(--mpa-font-size-xs);
      color: var(--mpa-color-text-muted);
      white-space: nowrap;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationAuditSummaryComponent {
  readonly items = input.required<readonly OrganizationAuditRecord[]>();
}
