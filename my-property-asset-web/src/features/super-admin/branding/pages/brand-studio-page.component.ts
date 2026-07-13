import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { AuthorizedButtonComponent } from '@core/rbac';
import { BasePageComponent, ButtonComponent, PageHeaderComponent } from '@shared/ui';

import {
  WlAssetsPanelComponent,
  WlColorsPanelComponent,
  WlIdentityPanelComponent,
  WlLogoPanelComponent,
  WlPreferencesPanelComponent,
  WlThemesPanelComponent,
  WlTypographyPanelComponent,
} from '../components/studio';
import {
  WlDevicePreviewComponent,
  WlLivePreviewContainerComponent,
  WlSectionNavComponent,
  WlThemePreviewPanelComponent,
} from '../components/shared';
import { BRAND_STUDIO_SECTIONS } from '../config/branding.config';
import { BrandStudioStateService } from '../services/brand-studio-state.service';

@Component({
  selector: 'app-brand-studio-page',
  imports: [
    BasePageComponent, PageHeaderComponent, ButtonComponent, AuthorizedButtonComponent,
    WlSectionNavComponent, WlDevicePreviewComponent, WlThemePreviewPanelComponent,
    WlLivePreviewContainerComponent,
    WlIdentityPanelComponent, WlLogoPanelComponent, WlColorsPanelComponent,
    WlTypographyPanelComponent, WlThemesPanelComponent, WlAssetsPanelComponent,
    WlPreferencesPanelComponent,
  ],
  template: `
    <app-base-page>
      <div class="wl-page wl-page--studio">
        <app-page-header eyebrow="Brand Experience" title="Brand Studio"
          [description]="'Editing ' + studio.previewBrand().identity.applicationName">
          <app-authorized-button pageActions label="Save brand" icon="pi pi-check"
            permission="id-04-white-label-branding:full" [loading]="saving"
            (clicked)="save()" />
          <app-button pageActions label="Reset" [outlined]="true" (clicked)="studio.resetDraft()" />
        </app-page-header>
        <app-wl-section-nav />

        <nav class="wl-studio-nav" aria-label="Studio sections">
          @for (s of sections; track s.id) {
            <button type="button" class="wl-studio-nav__chip"
              [class.wl-studio-nav__chip--active]="studio.activeSection() === s.id"
              (click)="studio.setSection(s.id)">
              <i [class]="s.icon" aria-hidden="true"></i> {{ s.label }}
            </button>
          }
        </nav>

        <div class="wl-studio-layout">
          <div class="wl-studio-layout__editor">
            @switch (studio.activeSection()) {
              @case ('identity') { <app-wl-identity-panel /> }
              @case ('logos') { <app-wl-logo-panel /> }
              @case ('colors') { <app-wl-colors-panel /> }
              @case ('typography') { <app-wl-typography-panel /> }
              @case ('themes') { <app-wl-themes-panel /> }
              @case ('assets') { <app-wl-assets-panel /> }
              @case ('preferences') { <app-wl-preferences-panel /> }
            }
          </div>
          <aside class="wl-studio-layout__preview">
            <div class="wl-studio-preview-toolbar">
              <app-wl-device-preview [device]="studio.previewDevice()"
                (deviceChange)="studio.setPreviewDevice($event)" />
              <app-wl-theme-preview-panel [mode]="studio.previewMode()" [surface]="studio.previewSurface()"
                (modeChange)="studio.setPreviewMode($event)"
                (surfaceChange)="studio.setPreviewSurface($event)" />
            </div>
            <app-wl-live-preview-container />
          </aside>
        </div>
      </div>
    </app-base-page>
  `,
  styleUrl: './brand-studio-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandStudioPageComponent {
  readonly studio = inject(BrandStudioStateService);
  readonly sections = BRAND_STUDIO_SECTIONS;
  saving = false;

  save(): void {
    this.saving = true;
    this.studio.save();
    this.saving = false;
  }
}
