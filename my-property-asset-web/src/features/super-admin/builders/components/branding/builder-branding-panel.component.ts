import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { ButtonComponent, UiToastService } from '@shared/ui';
import { BuilderBrandingService } from '@features/builder-portal/branding/services/builder-branding.service';
import { BuilderAdminRecord } from '../../models/builder-admin.model';
import { BuilderBrandIdentityCardComponent } from './builder-brand-identity-card.component';
import { BuilderLogoUploadComponent } from './builder-logo-upload.component';
import { BuilderThemePreviewComponent } from './builder-theme-preview.component';

@Component({
  selector: 'app-bldr-branding-panel',
  imports: [BuilderLogoUploadComponent, BuilderThemePreviewComponent, BuilderBrandIdentityCardComponent, ButtonComponent],
  template: `
    <div class="bldr-branding-panel">
      <div class="bldr-branding-panel__grid">
        <app-bldr-logo-upload [builder]="builder()" />
        <app-bldr-theme-preview [builder]="builder()" />
      </div>
      <app-bldr-brand-identity-card [builder]="builder()" />
      <section class="bldr-branding-panel__assets">
        <h3 class="mpa-heading-sm">Brand assets</h3>
        <p class="mpa-body-md m-0">
          Completion: {{ completion().completionPercent }}% ·
          {{ completion().missingItems.length ? completion().missingItems.join(', ') : 'Fully configured' }}
        </p>
        <div class="bldr-branding-panel__actions">
          <app-button label="Reset branding" [outlined]="true" (clicked)="resetBranding()" />
          <app-button label="Disable branding" severity="danger" [outlined]="true" (clicked)="disableBranding()" />
          <app-button label="Restore default" [outlined]="true" (clicked)="restoreDefault()" />
        </div>
      </section>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderBrandingPanelComponent {
  private readonly branding = inject(BuilderBrandingService);
  private readonly toast = inject(UiToastService);

  readonly builder = input.required<BuilderAdminRecord>();
  readonly completion = computed(() =>
    this.builder().organizationId
      ? this.branding.getCompletionForOrganization(this.builder().organizationId!)
      : { completionPercent: 0, missingItems: ['Organization link missing'], statusLabel: 'Draft' as const },
  );

  resetBranding(): void {
    const organizationId = this.builder().organizationId;
    if (!organizationId) return;
    this.branding.resetForOrganization(organizationId);
    this.toast.success('Branding reset', 'Builder branding draft was reset.');
  }

  disableBranding(): void {
    const organizationId = this.builder().organizationId;
    if (!organizationId) return;
    this.branding.disableForOrganization(organizationId);
    this.toast.info('Branding disabled', 'Platform defaults will apply.');
  }

  restoreDefault(): void {
    const organizationId = this.builder().organizationId;
    if (!organizationId) return;
    this.branding.restoreDefaultForOrganization(organizationId);
    this.toast.success('Branding restored', 'Default branding has been restored.');
  }
}
