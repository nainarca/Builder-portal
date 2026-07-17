import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { EnterpriseAttachmentPanelComponent } from '@shared/ui';

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
    EnterpriseAttachmentPanelComponent,
  ],
  template: `
    <div class="org-branding-panel">
      <div class="org-branding-panel__grid">
        <app-org-logo-upload [org]="org()" />
        <app-org-theme-preview [org]="org()" />
      </div>
      <app-org-identity-card [org]="org()" />
      <app-enterprise-attachment-panel
        title="Brand assets"
        [items]="[]"
        [showUpload]="false"
        emptyDescription="Logo variants, favicon, and email templates will appear here."
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationBrandingPanelComponent {
  readonly org = input.required<OrganizationAdminRecord>();
}
