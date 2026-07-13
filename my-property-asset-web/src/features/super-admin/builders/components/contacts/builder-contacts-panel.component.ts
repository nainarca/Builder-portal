import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ContentSectionComponent, SectionHeaderComponent } from '@shared/ui';

import { BuilderContactRecord } from '../../models/builder-admin.model';
import { BuilderContactStatisticsComponent } from './builder-contact-statistics.component';
import { BuilderContactsListComponent } from './builder-contacts-list.component';
import { BuilderInvitationStatusComponent } from './builder-invitation-status.component';
import { BuilderPrimaryContactCardComponent } from './builder-primary-contact-card.component';

@Component({
  selector: 'app-bldr-contacts-panel',
  imports: [
    ContentSectionComponent,
    SectionHeaderComponent,
    BuilderContactStatisticsComponent,
    BuilderPrimaryContactCardComponent,
    BuilderContactsListComponent,
    BuilderInvitationStatusComponent,
  ],
  template: `
    <app-content-section>
      <app-section-header title="Contacts" description="Builder contact overview (framework)" />
      <app-bldr-contact-statistics [contacts]="contacts()" />
      <div class="bldr-contacts-layout">
        <app-bldr-primary-contact-card [contacts]="contacts()" />
        <app-bldr-contacts-list [contacts]="contacts()" />
      </div>
      <app-bldr-invitation-status [contacts]="contacts()" />
    </app-content-section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderContactsPanelComponent {
  readonly contacts = input.required<readonly BuilderContactRecord[]>();
}
