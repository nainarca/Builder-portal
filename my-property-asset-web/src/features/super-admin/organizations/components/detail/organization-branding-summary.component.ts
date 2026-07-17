import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { EnterpriseDetailSectionComponent } from '@shared/ui';

import { OrganizationAdminRecord } from '../../models/organization-admin.model';
import { OrganizationBrandingPanelComponent } from '../branding/organization-branding-panel.component';

@Component({
  selector: 'app-org-branding-summary',
  imports: [EnterpriseDetailSectionComponent, OrganizationBrandingPanelComponent],
  template: `
    <app-enterprise-detail-section
      title="Branding"
      description="White-label presentation preview"
      headingId="org-branding-summary"
      variant="outlined"
    >
      <app-org-branding-panel [org]="org()" />
    </app-enterprise-detail-section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationBrandingSummaryComponent {
  readonly org = input.required<OrganizationAdminRecord>();
}
