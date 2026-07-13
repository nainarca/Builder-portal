import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ContentSectionComponent, SectionHeaderComponent } from '@shared/ui';

import { OrganizationAdminRecord } from '../../models/organization-admin.model';
import { OrganizationBrandingPanelComponent } from '../branding/organization-branding-panel.component';

@Component({
  selector: 'app-org-branding-summary',
  imports: [ContentSectionComponent, SectionHeaderComponent, OrganizationBrandingPanelComponent],
  template: `
    <app-content-section>
      <app-section-header title="Branding" description="White-label presentation preview" />
      <app-org-branding-panel [org]="org()" />
    </app-content-section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationBrandingSummaryComponent {
  readonly org = input.required<OrganizationAdminRecord>();
}
