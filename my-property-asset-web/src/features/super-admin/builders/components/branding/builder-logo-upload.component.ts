import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ButtonComponent } from '@shared/ui';

import { BuilderAdminRecord } from '../../models/builder-admin.model';
import { BuilderAvatarComponent } from '../shared/builder-avatar.component';

@Component({
  selector: 'app-bldr-logo-upload',
  imports: [ButtonComponent, BuilderAvatarComponent],
  template: `
    <section class="bldr-logo-upload" aria-label="Logo upload">
      <h3 class="mpa-heading-sm">Builder logo</h3>
      <app-bldr-avatar [name]="builder().companyName" [logoUrl]="builder().logoUrl" [primaryColor]="builder().primaryColor ?? '#1B4D89'" size="lg" />
      <p class="bldr-logo-upload__hint">Upload UI framework — no file storage connected.</p>
      <app-button label="Upload logo" icon="pi pi-upload" [outlined]="true" [disabled]="true" />
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderLogoUploadComponent {
  readonly builder = input.required<BuilderAdminRecord>();
}
