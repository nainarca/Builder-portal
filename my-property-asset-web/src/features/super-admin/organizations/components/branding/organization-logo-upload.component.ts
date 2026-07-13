import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ButtonComponent } from '@shared/ui';

import { OrganizationAdminRecord } from '../../models/organization-admin.model';
import { OrganizationAvatarComponent } from '../shared/organization-avatar.component';

@Component({
  selector: 'app-org-logo-upload',
  imports: [ButtonComponent, OrganizationAvatarComponent],
  template: `
    <section class="org-logo-upload" aria-label="Logo upload">
      <h3 class="mpa-heading-sm">Organization logo</h3>
      <app-org-avatar [name]="org().name" [logoUrl]="org().logoUrl" [primaryColor]="org().primaryColor ?? '#1B4D89'" size="lg" />
      <p class="org-logo-upload__hint">Upload UI framework — no file storage connected.</p>
      <app-button label="Upload logo" icon="pi pi-upload" [outlined]="true" [disabled]="true" />
      <app-button label="Remove" icon="pi pi-trash" [text]="true" [disabled]="true" />
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationLogoUploadComponent {
  readonly org = input.required<OrganizationAdminRecord>();
}
