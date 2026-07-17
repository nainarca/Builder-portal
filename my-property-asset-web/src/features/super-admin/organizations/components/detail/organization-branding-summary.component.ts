import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { EnterpriseSectionHeaderComponent } from '@shared/ui';

import { OrganizationAdminRecord } from '../../models/organization-admin.model';
import { OrganizationBrandingPanelComponent } from '../branding/organization-branding-panel.component';

@Component({
  selector: 'app-org-branding-summary',
  imports: [EnterpriseSectionHeaderComponent, OrganizationBrandingPanelComponent],
  template: `
    <section class="org-branding-summary" aria-label="Organization branding">
      <app-enterprise-section-header
        title="Branding"
        description="White-label presentation preview"
      />
      <app-org-branding-panel [org]="org()" />
    </section>
  `,
  styles: `
    .org-branding-summary {
      display: grid;
      gap: var(--mpa-spacing-md);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationBrandingSummaryComponent {
  readonly org = input.required<OrganizationAdminRecord>();
}
