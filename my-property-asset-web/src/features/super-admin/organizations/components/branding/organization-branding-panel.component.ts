import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { OrganizationAdminRecord } from '../../models/organization-admin.model';
import { OrganizationIdentityCardComponent } from './organization-identity-card.component';
import { OrganizationLogoUploadComponent } from './organization-logo-upload.component';
import { OrganizationThemePreviewComponent } from './organization-theme-preview.component';

@Component({
  selector: 'app-org-branding-panel',
  imports: [
    OrganizationLogoUploadComponent,
    OrganizationThemePreviewComponent,
    OrganizationIdentityCardComponent,
  ],
  template: `
    <div class="org-branding-panel">
      <div class="org-branding-panel__grid">
        <app-org-logo-upload [org]="org()" />
        <app-org-theme-preview [org]="org()" />
      </div>
      <app-org-identity-card [org]="org()" />
      <section class="org-branding-panel__assets" aria-label="Brand assets placeholder">
        <h3 class="mpa-heading-sm">Brand assets</h3>
        <p class="mpa-body-md m-0">Logo variants, favicon, and email templates — framework placeholder.</p>
      </section>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationBrandingPanelComponent {
  readonly org = input.required<OrganizationAdminRecord>();
}
