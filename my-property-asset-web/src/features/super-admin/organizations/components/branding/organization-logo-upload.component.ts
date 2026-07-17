import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { GhostButtonComponent, OutlineButtonComponent } from '@shared/ui';

import { OrganizationAdminRecord } from '../../models/organization-admin.model';
import { OrganizationAvatarComponent } from '../shared/organization-avatar.component';

@Component({
  selector: 'app-org-logo-upload',
  imports: [OutlineButtonComponent, GhostButtonComponent, OrganizationAvatarComponent],
  template: `
    <section class="org-logo-upload" aria-label="Logo upload">
      <h3 class="mpa-heading-sm">Organization logo</h3>
      <app-org-avatar
        [name]="org().name"
        [logoUrl]="org().logoUrl"
        [primaryColor]="org().primaryColor ?? '#1B4D89'"
        size="lg"
      />
      <p class="org-logo-upload__hint">Upload UI framework — no file storage connected.</p>
      <div class="org-logo-upload__actions">
        <app-outline-button label="Upload logo" icon="pi pi-upload" [disabled]="true" />
        <app-ghost-button label="Remove" icon="pi pi-trash" [disabled]="true" />
      </div>
    </section>
  `,
  styles: `
    .org-logo-upload {
      display: grid;
      gap: var(--mpa-spacing-md);
    }

    .org-logo-upload__hint {
      margin: 0;
      font-size: var(--mpa-font-size-sm);
      color: var(--mpa-color-text-muted);
    }

    .org-logo-upload__actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--mpa-spacing-xs);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationLogoUploadComponent {
  readonly org = input.required<OrganizationAdminRecord>();
}
