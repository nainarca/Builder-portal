import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ContentSectionComponent, SectionHeaderComponent } from '@shared/ui';

import { BuilderAdminRecord } from '../../models/builder-admin.model';
import { BuilderBrandingPanelComponent } from '../branding/builder-branding-panel.component';

@Component({
  selector: 'app-bldr-branding-summary',
  imports: [ContentSectionComponent, SectionHeaderComponent, BuilderBrandingPanelComponent],
  template: `
    <app-content-section>
      <app-section-header title="Branding" description="White-label presentation preview" />
      <app-bldr-branding-panel [builder]="builder()" />
    </app-content-section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderBrandingSummaryComponent {
  readonly builder = input.required<BuilderAdminRecord>();
}
