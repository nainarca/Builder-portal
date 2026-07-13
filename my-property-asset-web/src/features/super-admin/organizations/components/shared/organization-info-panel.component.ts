import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { OrganizationAdminRecord } from '../../models/organization-admin.model';

export interface OrganizationInfoItem {
  readonly label: string;
  readonly value: string;
}

@Component({
  selector: 'app-org-info-panel',
  template: `
    <section class="org-info-panel" aria-label="Organization information">
      <h2 class="org-info-panel__title">{{ title() }}</h2>
      <dl class="org-info-panel__list">
        @for (item of items(); track item.label) {
          <div class="org-info-panel__row">
            <dt>{{ item.label }}</dt>
            <dd>{{ item.value }}</dd>
          </div>
        }
      </dl>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationInfoPanelComponent {
  readonly title = input('Organization profile');
  readonly org = input<OrganizationAdminRecord | undefined>(undefined);
  readonly items = input<OrganizationInfoItem[]>([]);
}
