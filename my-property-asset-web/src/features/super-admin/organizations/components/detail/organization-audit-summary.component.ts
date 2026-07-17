import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import {
  EnterpriseDetailEmptyComponent,
  EnterpriseDetailSectionComponent,
  TimelineCardComponent,
  type EnterpriseTimelineEvent,
} from '@shared/ui';

import { OrganizationAuditRecord } from '../../models/organization-admin.model';

@Component({
  selector: 'app-org-audit-summary',
  imports: [
    EnterpriseDetailSectionComponent,
    TimelineCardComponent,
    EnterpriseDetailEmptyComponent,
  ],
  template: `
    <app-enterprise-detail-section
      title="Audit summary"
      description="Administrative actions on this organization"
      headingId="org-audit"
      variant="outlined"
    >
      @if (events().length) {
        <app-timeline-card [events]="events()" />
      } @else {
        <app-enterprise-detail-empty
          variant="no-history"
          title="No audit entries"
          description="Administrative actions will be recorded here."
        />
      }
    </app-enterprise-detail-section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationAuditSummaryComponent {
  readonly items = input.required<readonly OrganizationAuditRecord[]>();

  readonly events = computed((): readonly EnterpriseTimelineEvent[] =>
    this.items().map((item) => ({
      id: item.id,
      title: item.action,
      description: `${item.detail} · ${item.actor}`,
      timestamp: new Date(item.timestamp).toLocaleString(),
      absoluteTimestamp: item.timestamp,
      icon: 'pi pi-shield',
    })),
  );
}
