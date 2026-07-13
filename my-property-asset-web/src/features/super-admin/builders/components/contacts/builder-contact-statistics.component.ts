import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { BuilderContactRecord } from '../../models/builder-admin.model';
import { BuilderStatisticsCardsComponent } from '../shared/builder-statistics-cards.component';

@Component({
  selector: 'app-bldr-contact-statistics',
  imports: [BuilderStatisticsCardsComponent],
  template: `<app-bldr-statistics-cards [stats]="stats()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderContactStatisticsComponent {
  readonly contacts = input.required<readonly BuilderContactRecord[]>();
  readonly stats = computed(() => {
    const c = this.contacts();
    return [
      { label: 'Total contacts', value: String(c.length) },
      { label: 'Active', value: String(c.filter((x) => x.status === 'active').length) },
      { label: 'Invited', value: String(c.filter((x) => x.status === 'invited').length) },
      { label: 'Administrators', value: String(c.filter((x) => String(x.role).includes('admin') || String(x.role).includes('owner')).length) },
    ];
  });
}
