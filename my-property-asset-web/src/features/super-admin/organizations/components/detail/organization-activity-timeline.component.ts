import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import {
  EnterpriseDetailEmptyComponent,
  EnterpriseDetailSectionComponent,
  TimelineCardComponent,
  type EnterpriseTimelineEvent,
} from '@shared/ui';

import { OrganizationActivityRecord } from '../../models/organization-admin.model';

@Component({
  selector: 'app-org-activity-timeline',
  imports: [
    EnterpriseDetailSectionComponent,
    TimelineCardComponent,
    EnterpriseDetailEmptyComponent,
  ],
  template: `
    <app-enterprise-detail-section
      title="Recent activity"
      description="Latest organization events and changes"
      headingId="org-activity"
      variant="outlined"
    >
      @if (events().length) {
        <app-timeline-card [events]="events()" />
      } @else {
        <app-enterprise-detail-empty
          variant="no-activity"
          title="No activity yet"
          description="Organization events will appear here as they occur."
        />
      }
    </app-enterprise-detail-section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationActivityTimelineComponent {
  readonly items = input.required<readonly OrganizationActivityRecord[]>();

  readonly events = computed((): readonly EnterpriseTimelineEvent[] =>
    this.items().map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      timestamp: new Date(item.timestamp).toLocaleString(),
      absoluteTimestamp: item.timestamp,
      icon: this.iconFor(item.type),
    })),
  );

  private iconFor(type: OrganizationActivityRecord['type']): string {
    switch (type) {
      case 'status':
        return 'pi pi-check-circle';
      case 'member':
        return 'pi pi-users';
      case 'branding':
        return 'pi pi-palette';
      default:
        return 'pi pi-cog';
    }
  }
}
