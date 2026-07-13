import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { StatusBadgeComponent } from '@shared/ui';

import { BuilderContactRecord } from '../../models/builder-admin.model';

@Component({
  selector: 'app-bldr-contacts-list',
  imports: [StatusBadgeComponent],
  template: `
    <ul class="bldr-contacts-list">
      @for (c of additional(); track c.id) {
        <li>
          <div><strong>{{ c.name }}</strong><p>{{ c.email }}</p></div>
          <app-status-badge [label]="c.status" [severity]="c.status === 'active' ? 'success' : 'warn'" />
        </li>
      } @empty { <li>No additional contacts.</li> }
    </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderContactsListComponent {
  readonly contacts = input.required<readonly BuilderContactRecord[]>();
  readonly additional = computed(() => this.contacts().filter((c) => !c.isPrimary));
}
