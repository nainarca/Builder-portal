import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DatePipe, JsonPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthorizedButtonComponent } from '@core/rbac';
import { BasePageComponent, ButtonComponent, PageHeaderComponent, UiToastService } from '@shared/ui';
import { WlDevicePreviewComponent } from '@features/super-admin/branding/components/shared/wl-device-preview.component';
import { WlThemePreviewPanelComponent } from '@features/super-admin/branding/components/shared/wl-theme-preview-panel.component';
import { PreviewDevice, PreviewSurface } from '@features/super-admin/branding/models/brand-admin.model';
import { BuilderBrandLivePreviewComponent } from '../components/builder-brand-live-preview.component';
import { BuilderBrandingFormModel, BuilderBrandingProfile } from '../models/builder-branding.model';
import { BuilderBrandingService } from '../services/builder-branding.service';

@Component({
  selector: 'app-builder-branding-page',
  imports: [
    DatePipe,
    JsonPipe,
    ReactiveFormsModule,
    BasePageComponent,
    PageHeaderComponent,
    ButtonComponent,
    AuthorizedButtonComponent,
    WlDevicePreviewComponent,
    WlThemePreviewPanelComponent,
    BuilderBrandLivePreviewComponent,
  ],
  template: `
    <app-base-page>
      <div class="bp-branding-page">
        <app-page-header
          eyebrow="Builder Portal"
          title="White Label Branding"
          description="Configure builder identity, theme, support details, and API payload for the Owner App."
        >
          <app-authorized-button
            pageActions
            label="Save branding"
            icon="pi pi-check"
            permission="id-04-white-label-branding:full"
            (clicked)="save()"
          />
          <app-authorized-button
            pageActions
            label="Disable"
            icon="pi pi-ban"
            severity="danger"
            [outlined]="true"
            permission="id-04-white-label-branding:full"
            (clicked)="disable()"
          />
          <app-authorized-button
            pageActions
            label="Restore default"
            icon="pi pi-refresh"
            [outlined]="true"
            permission="id-04-white-label-branding:full"
            (clicked)="restoreDefault()"
          />
          <app-button pageActions label="Reset draft" [outlined]="true" (clicked)="resetForm()" />
        </app-page-header>

        <section class="bp-branding-page__status">
          <article class="bp-branding-card">
            <span class="bp-branding-card__label">Branding completion</span>
            <strong class="bp-branding-card__value">{{ completion().completionPercent }}%</strong>
            <span class="bp-branding-card__meta">{{ completion().statusLabel }}</span>
          </article>
          <article class="bp-branding-card">
            <span class="bp-branding-card__label">Last updated</span>
            <strong class="bp-branding-card__value">{{ branding().lastUpdatedAt | date: 'medium' }}</strong>
            <span class="bp-branding-card__meta">Saved branding profile</span>
          </article>
          <article class="bp-branding-card">
            <span class="bp-branding-card__label">Warnings</span>
            <strong class="bp-branding-card__value">{{ completion().missingItems.length }}</strong>
            <span class="bp-branding-card__meta">
              {{ completion().missingItems.length ? completion().missingItems.join(', ') : 'No missing configuration' }}
            </span>
          </article>
        </section>

        <div class="bp-branding-layout">
          <form class="bp-branding-form" [formGroup]="form">
            <section class="bp-branding-section">
              <h3>Identity</h3>
              <div class="bp-branding-grid">
                <label><span>Builder company name</span><input type="text" formControlName="companyName" /></label>
                <label><span>Display name</span><input type="text" formControlName="displayName" /></label>
                <label><span>Short name</span><input type="text" formControlName="shortName" /></label>
                <label><span>Application name</span><input type="text" formControlName="applicationName" /></label>
                <label class="bp-branding-grid__full"><span>Tagline</span><input type="text" formControlName="tagline" /></label>
              </div>
            </section>

            <section class="bp-branding-section">
              <h3>Media</h3>
              <div class="bp-branding-grid" formGroupName="media">
                <label><span>Logo</span><input type="url" formControlName="logo" /></label>
                <label><span>Dark logo</span><input type="url" formControlName="darkLogo" /></label>
                <label><span>Favicon</span><input type="url" formControlName="favicon" /></label>
                <label><span>Login background</span><input type="url" formControlName="loginBackground" /></label>
                <label><span>Dashboard banner</span><input type="url" formControlName="dashboardBanner" /></label>
                <label><span>Mobile splash image</span><input type="url" formControlName="mobileSplashImage" /></label>
              </div>
            </section>

            <section class="bp-branding-section">
              <h3>Colors and Contact</h3>
              <div class="bp-branding-grid">
                <label><span>Primary color</span><input type="color" formControlName="primaryColor" /></label>
                <label><span>Secondary color</span><input type="color" formControlName="secondaryColor" /></label>
                <label><span>Accent color</span><input type="color" formControlName="accentColor" /></label>
                <label><span>Support email</span><input type="email" formControlName="supportEmail" /></label>
                <label><span>Support phone</span><input type="text" formControlName="supportPhone" /></label>
                <label><span>Website</span><input type="url" formControlName="website" /></label>
                <label class="bp-branding-grid__full"><span>Office address</span><textarea rows="3" formControlName="officeAddress"></textarea></label>
              </div>
            </section>

            <section class="bp-branding-section">
              <h3>Legal and Social</h3>
              <div class="bp-branding-grid">
                <label><span>Copyright</span><input type="text" formControlName="copyright" /></label>
                <label><span>Terms URL</span><input type="url" formControlName="termsUrl" /></label>
                <label><span>Privacy policy URL</span><input type="url" formControlName="privacyPolicyUrl" /></label>
              </div>
              <div class="bp-branding-grid" formGroupName="socialLinks">
                <label><span>LinkedIn</span><input type="url" formControlName="linkedin" /></label>
                <label><span>Instagram</span><input type="url" formControlName="instagram" /></label>
                <label><span>Facebook</span><input type="url" formControlName="facebook" /></label>
                <label><span>X / Twitter</span><input type="url" formControlName="x" /></label>
                <label><span>YouTube</span><input type="url" formControlName="youtube" /></label>
              </div>
            </section>

            <section class="bp-branding-section">
              <h3>Theme Settings</h3>
              <div class="bp-branding-grid" formGroupName="theme">
                <label>
                  <span>Light theme</span>
                  <select formControlName="lightTheme"><option value="light">Light</option><option value="system">System</option></select>
                </label>
                <label>
                  <span>Dark theme</span>
                  <select formControlName="darkTheme"><option value="dark">Dark</option><option value="system">System</option></select>
                </label>
                <label>
                  <span>Button style</span>
                  <select formControlName="buttonStyle"><option value="rounded">Rounded</option><option value="pill">Pill</option><option value="sharp">Sharp</option></select>
                </label>
                <label>
                  <span>Navigation style</span>
                  <select formControlName="navigationStyle"><option value="solid">Solid</option><option value="elevated">Elevated</option><option value="minimal">Minimal</option></select>
                </label>
                <label>
                  <span>Card style</span>
                  <select formControlName="cardStyle"><option value="soft">Soft</option><option value="outlined">Outlined</option><option value="elevated">Elevated</option></select>
                </label>
                <label>
                  <span>Dashboard theme</span>
                  <select formControlName="dashboardTheme"><option value="default">Default</option><option value="compact">Compact</option><option value="executive">Executive</option></select>
                </label>
                <label>
                  <span>Typography</span>
                  <select formControlName="typography"><option value="inter">Inter</option><option value="dm-sans">DM Sans</option><option value="plus-jakarta">Plus Jakarta Sans</option><option value="system">System</option></select>
                </label>
              </div>
              <label class="bp-branding-toggle">
                <input type="checkbox" formControlName="enabled" />
                <span>Branding enabled</span>
              </label>
            </section>
          </form>

          <aside class="bp-branding-preview">
            <div class="bp-branding-preview__toolbar">
              <app-wl-device-preview [device]="previewDevice()" (deviceChange)="previewDevice.set($event)" />
              <app-wl-theme-preview-panel
                [mode]="previewMode()"
                [surface]="previewSurface()"
                (modeChange)="previewMode.set($event)"
                (surfaceChange)="previewSurface.set($event)"
              />
            </div>

            <app-builder-brand-live-preview
              [branding]="draftBranding()"
              [mode]="previewMode()"
              [device]="previewDevice()"
              [surface]="previewSurface()"
            />

            <section class="bp-branding-section">
              <h3>Storage structure</h3>
              <ul class="bp-branding-list">
                @for (asset of storageAssets(); track asset.slot) {
                  <li><code>{{ asset.slot }}</code> → <code>{{ asset.path }}</code></li>
                }
              </ul>
            </section>

            <section class="bp-branding-section">
              <h3>Owner App contract</h3>
              <pre>{{ flutterPayload() | json }}</pre>
            </section>
          </aside>
        </div>
      </div>
    </app-base-page>
  `,
  styles: `
    .bp-branding-page { display: flex; flex-direction: column; gap: 1.25rem; }
    .bp-branding-page__status {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1rem;
    }
    .bp-branding-card,
    .bp-branding-section {
      background: var(--mpa-color-surface);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-lg, 0.75rem);
      padding: 1rem;
      box-shadow: var(--mpa-shadow-sm);
    }
    .bp-branding-card { display: flex; flex-direction: column; gap: 0.35rem; }
    .bp-branding-card__label,
    .bp-branding-card__meta { color: var(--mpa-color-text-muted); font-size: 0.875rem; }
    .bp-branding-card__value { font-size: 1.1rem; }
    .bp-branding-layout {
      display: grid;
      grid-template-columns: minmax(0, 1.3fr) minmax(380px, 0.9fr);
      gap: 1rem;
      align-items: start;
    }
    .bp-branding-form { display: flex; flex-direction: column; gap: 1rem; }
    .bp-branding-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.85rem;
    }
    .bp-branding-grid label,
    .bp-branding-toggle {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      font-size: 0.875rem;
      color: var(--mpa-color-text-muted);
    }
    .bp-branding-grid__full { grid-column: 1 / -1; }
    .bp-branding-grid input,
    .bp-branding-grid select,
    .bp-branding-grid textarea {
      width: 100%;
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-sm, 0.375rem);
      padding: 0.65rem 0.75rem;
      background: var(--mpa-color-surface);
      color: var(--mpa-color-text);
      font: inherit;
    }
    .bp-branding-grid input[type='color'] { min-height: 2.6rem; padding: 0.25rem; }
    .bp-branding-toggle {
      justify-content: flex-end;
      color: var(--mpa-color-text);
    }
    .bp-branding-toggle input { margin: 0; }
    .bp-branding-preview { display: flex; flex-direction: column; gap: 1rem; position: sticky; top: 1rem; }
    .bp-branding-preview__toolbar {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding: 1rem;
      background: var(--mpa-color-surface);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-lg, 0.75rem);
    }
    .bp-branding-list { margin: 0; padding-left: 1rem; display: flex; flex-direction: column; gap: 0.35rem; }
    pre {
      margin: 0;
      max-height: 280px;
      overflow: auto;
      padding: 0.75rem;
      border-radius: var(--mpa-radius-sm, 0.375rem);
      background: var(--mpa-color-background);
      font-size: 0.8rem;
    }
    @media (max-width: 1080px) {
      .bp-branding-page__status,
      .bp-branding-layout,
      .bp-branding-grid {
        grid-template-columns: 1fr;
      }
      .bp-branding-preview { position: static; }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderBrandingPageComponent {
  private readonly brandingService = inject(BuilderBrandingService);
  private readonly toast = inject(UiToastService);

  readonly branding = this.brandingService.activeBranding;
  readonly completion = this.brandingService.completion;
  readonly storageAssets = this.brandingService.storageAssets;

  readonly previewMode = signal<'light' | 'dark'>('light');
  readonly previewDevice = signal<PreviewDevice>('desktop');
  readonly previewSurface = signal<PreviewSurface>('builder-portal');

  readonly form = this.createForm(this.branding());
  readonly draftBranding = computed(() => this.toProfile(this.form.getRawValue()));
  readonly flutterPayload = computed(() =>
    this.brandingService.toFlutterPayload(this.draftBranding()),
  );

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const saved = this.brandingService.save(this.form.getRawValue() as BuilderBrandingFormModel);
    this.form.patchValue(this.brandingService.toFormModel(saved));
    this.toast.success('Branding saved', 'Builder branding has been updated.');
  }

  resetForm(): void {
    this.form.reset(this.brandingService.toFormModel(this.branding()));
  }

  disable(): void {
    const disabled = this.brandingService.disable();
    if (!disabled) {
      return;
    }
    this.form.patchValue(this.brandingService.toFormModel(disabled));
    this.toast.info('Branding disabled', 'Platform defaults are now active.');
  }

  restoreDefault(): void {
    const restored = this.brandingService.restoreDefault();
    this.form.patchValue(this.brandingService.toFormModel(restored));
    this.toast.success('Branding restored', 'Default builder branding has been restored.');
  }

  private createForm(profile: BuilderBrandingProfile): FormGroup {
    const model = this.brandingService.toFormModel(profile);
    return new FormGroup({
      companyName: new FormControl(model.companyName, { nonNullable: true, validators: [Validators.required] }),
      displayName: new FormControl(model.displayName, { nonNullable: true, validators: [Validators.required] }),
      shortName: new FormControl(model.shortName, { nonNullable: true, validators: [Validators.required] }),
      applicationName: new FormControl(model.applicationName, { nonNullable: true, validators: [Validators.required] }),
      tagline: new FormControl(model.tagline, { nonNullable: true }),
      primaryColor: new FormControl(model.primaryColor, { nonNullable: true }),
      secondaryColor: new FormControl(model.secondaryColor, { nonNullable: true }),
      accentColor: new FormControl(model.accentColor, { nonNullable: true }),
      supportEmail: new FormControl(model.supportEmail, { nonNullable: true, validators: [Validators.required, Validators.email] }),
      supportPhone: new FormControl(model.supportPhone, { nonNullable: true }),
      website: new FormControl(model.website, { nonNullable: true }),
      officeAddress: new FormControl(model.officeAddress, { nonNullable: true }),
      copyright: new FormControl(model.copyright, { nonNullable: true }),
      termsUrl: new FormControl(model.termsUrl, { nonNullable: true }),
      privacyPolicyUrl: new FormControl(model.privacyPolicyUrl, { nonNullable: true }),
      socialLinks: new FormGroup({
        linkedin: new FormControl(model.socialLinks.linkedin ?? '', { nonNullable: true }),
        instagram: new FormControl(model.socialLinks.instagram ?? '', { nonNullable: true }),
        facebook: new FormControl(model.socialLinks.facebook ?? '', { nonNullable: true }),
        x: new FormControl(model.socialLinks.x ?? '', { nonNullable: true }),
        youtube: new FormControl(model.socialLinks.youtube ?? '', { nonNullable: true }),
      }),
      media: new FormGroup({
        logo: new FormControl(model.media.logo, { nonNullable: true }),
        darkLogo: new FormControl(model.media.darkLogo, { nonNullable: true }),
        favicon: new FormControl(model.media.favicon, { nonNullable: true }),
        loginBackground: new FormControl(model.media.loginBackground, { nonNullable: true }),
        dashboardBanner: new FormControl(model.media.dashboardBanner, { nonNullable: true }),
        mobileSplashImage: new FormControl(model.media.mobileSplashImage, { nonNullable: true }),
      }),
      theme: new FormGroup({
        lightTheme: new FormControl(model.theme.lightTheme, { nonNullable: true }),
        darkTheme: new FormControl(model.theme.darkTheme, { nonNullable: true }),
        buttonStyle: new FormControl(model.theme.buttonStyle, { nonNullable: true }),
        navigationStyle: new FormControl(model.theme.navigationStyle, { nonNullable: true }),
        cardStyle: new FormControl(model.theme.cardStyle, { nonNullable: true }),
        dashboardTheme: new FormControl(model.theme.dashboardTheme, { nonNullable: true }),
        typography: new FormControl(model.theme.typography, { nonNullable: true }),
      }),
      enabled: new FormControl(model.enabled, { nonNullable: true }),
    });
  }

  private toProfile(value: ReturnType<FormGroup['getRawValue']>): BuilderBrandingProfile {
    return {
      organizationId: this.branding().organizationId,
      ...(value as BuilderBrandingFormModel),
      lastUpdatedAt: this.branding().lastUpdatedAt,
    };
  }
}
