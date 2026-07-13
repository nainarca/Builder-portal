import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { BuilderAdminRecord } from '../../models/builder-admin.model';

@Component({
  selector: 'app-bldr-theme-preview',
  template: `
    <section class="bldr-theme-preview" aria-label="Theme preview">
      <h3 class="mpa-heading-sm">Brand colors</h3>
      <div class="bldr-theme-preview__swatches">
        <span class="bldr-theme-preview__swatch" [style.background]="primary()" title="Primary"></span>
        <span class="bldr-theme-preview__swatch" [style.background]="secondary()" title="Secondary"></span>
      </div>
      <div class="bldr-theme-preview__card" [style.borderColor]="primary()">
        <div class="bldr-theme-preview__header" [style.background]="primary()">Builder portal header</div>
        <div class="bldr-theme-preview__body">
          <p>Sample builder portal surface with branding applied.</p>
          <button type="button" class="bldr-theme-preview__btn" [style.background]="primary()">Primary</button>
          <button type="button" class="bldr-theme-preview__btn bldr-theme-preview__btn--secondary" [style.background]="secondary()">Secondary</button>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderThemePreviewComponent {
  readonly builder = input.required<BuilderAdminRecord>();
  readonly primary = computed(() => this.builder().primaryColor ?? '#1B4D89');
  readonly secondary = computed(() => this.builder().secondaryColor ?? '#3B82F6');
}
