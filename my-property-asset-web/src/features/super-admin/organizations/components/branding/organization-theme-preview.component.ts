import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { OrganizationAdminRecord } from '../../models/organization-admin.model';

@Component({
  selector: 'app-org-theme-preview',
  template: `
    <section class="org-theme-preview" aria-label="Theme preview">
      <h3 class="mpa-heading-sm">Brand color preview</h3>
      <div class="org-theme-preview__swatches">
        <span class="org-theme-preview__swatch" [style.background]="primaryColor()"></span>
        <span class="org-theme-preview__swatch org-theme-preview__swatch--subtle"
          [style.background]="'color-mix(in srgb, ' + primaryColor() + ' 14%, var(--mpa-color-surface))'"></span>
      </div>
      <div class="org-theme-preview__card" [style.borderColor]="primaryColor()">
        <div class="org-theme-preview__card-header" [style.background]="primaryColor()">Portal header</div>
        <div class="org-theme-preview__card-body">
          <p>Sample portal surface with organization branding applied.</p>
          <button type="button" class="org-theme-preview__button" [style.background]="primaryColor()">
            Primary action
          </button>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationThemePreviewComponent {
  readonly org = input.required<OrganizationAdminRecord>();

  readonly primaryColor = computed(() => this.org().primaryColor ?? '#1B4D89');
}
