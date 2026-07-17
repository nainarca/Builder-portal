import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import {
  EnterpriseImageUploadComponent,
  type EnterpriseUploadFile,
} from '@shared/ui';

import { OrganizationAdminRecord } from '../../models/organization-admin.model';

@Component({
  selector: 'app-org-logo-upload',
  imports: [EnterpriseImageUploadComponent],
  template: `
    <section class="org-logo-upload" aria-label="Logo upload">
      <app-enterprise-image-upload
        label="Organization logo"
        [files]="previewFiles()"
        [disabled]="true"
        hint="Upload UI framework — no file storage connected."
      />
    </section>
  `,
  styles: `
    .org-logo-upload {
      display: grid;
      gap: var(--mpa-spacing-md);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationLogoUploadComponent {
  readonly org = input.required<OrganizationAdminRecord>();

  readonly previewFiles = computed((): readonly EnterpriseUploadFile[] => {
    const logo = this.org().logoUrl;
    if (!logo) {
      return [];
    }
    return [
      {
        id: 'org-logo',
        name: `${this.org().name} logo`,
        size: 0,
        type: 'image/*',
        previewUrl: logo,
        status: 'complete',
      },
    ];
  });
}
