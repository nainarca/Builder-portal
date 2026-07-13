import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ContentSectionComponent, SectionHeaderComponent } from '@shared/ui';

import { BuilderAdminRecord } from '../../models/builder-admin.model';

@Component({
  selector: 'app-bldr-integration-placeholders',
  imports: [ContentSectionComponent, SectionHeaderComponent],
  template: `
    <app-content-section>
      <app-section-header title="Platform summaries" description="Future integration placeholders — ADMIN-004+" />
      <div class="bldr-placeholders">
        @for (item of placeholders; track item.label) {
          <article class="bldr-placeholders__card">
            <i [class]="item.icon" aria-hidden="true"></i>
            <h3>{{ item.label }}</h3>
            <p class="bldr-placeholders__value">{{ item.value(builder()) }}</p>
            <p class="bldr-placeholders__hint">{{ item.hint }}</p>
          </article>
        }
      </div>
    </app-content-section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderIntegrationPlaceholdersComponent {
  readonly builder = input.required<BuilderAdminRecord>();

  readonly placeholders = [
    { label: 'Projects', icon: 'pi pi-folder', value: (b: BuilderAdminRecord) => String(b.projectCount), hint: 'Project module — coming soon' },
    { label: 'Units', icon: 'pi pi-home', value: (b: BuilderAdminRecord) => String(b.unitCount), hint: 'Unit inventory — coming soon' },
    { label: 'Owners', icon: 'pi pi-users', value: (b: BuilderAdminRecord) => String(b.ownerCount), hint: 'Owner assignment — coming soon' },
    { label: 'Documents', icon: 'pi pi-file', value: (b: BuilderAdminRecord) => String(b.documentCount), hint: 'Document library — coming soon' },
    { label: 'Invitations', icon: 'pi pi-envelope', value: (b: BuilderAdminRecord) => String(b.invitationCount), hint: 'Invitation workflow — coming soon' },
  ];
}
