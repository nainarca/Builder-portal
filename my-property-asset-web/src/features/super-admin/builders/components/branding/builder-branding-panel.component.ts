import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { BuilderAdminRecord } from '../../models/builder-admin.model';
import { BuilderBrandIdentityCardComponent } from './builder-brand-identity-card.component';
import { BuilderLogoUploadComponent } from './builder-logo-upload.component';
import { BuilderThemePreviewComponent } from './builder-theme-preview.component';

@Component({
  selector: 'app-bldr-branding-panel',
  imports: [BuilderLogoUploadComponent, BuilderThemePreviewComponent, BuilderBrandIdentityCardComponent],
  template: `
    <div class="bldr-branding-panel">
      <div class="bldr-branding-panel__grid">
        <app-bldr-logo-upload [builder]="builder()" />
        <app-bldr-theme-preview [builder]="builder()" />
      </div>
      <app-bldr-brand-identity-card [builder]="builder()" />
      <section class="bldr-branding-panel__assets">
        <h3 class="mpa-heading-sm">Brand assets</h3>
        <p class="mpa-body-md m-0">Logo variants, favicon, and email templates — framework placeholder.</p>
      </section>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderBrandingPanelComponent {
  readonly builder = input.required<BuilderAdminRecord>();
}
