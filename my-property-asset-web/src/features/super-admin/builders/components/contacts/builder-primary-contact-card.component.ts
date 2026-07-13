import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { StatusBadgeComponent } from '@shared/ui';

import { BuilderContactRecord } from '../../models/builder-admin.model';

@Component({
  selector: 'app-bldr-primary-contact-card',
  imports: [StatusBadgeComponent],
  template: `
    @if (primary(); as c) {
      <article class="bldr-primary-contact">
        <span class="bldr-primary-contact__label">Primary contact</span>
        <h3>{{ c.name }}</h3>
        <p>{{ c.email }}</p>
        @if (c.phone) { <p>{{ c.phone }}</p> }
        <app-status-badge [label]="c.role" severity="info" />
      </article>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderPrimaryContactCardComponent {
  readonly contacts = input.required<readonly BuilderContactRecord[]>();
  readonly primary = computed(() => this.contacts().find((c) => c.isPrimary) ?? this.contacts()[0]);
}
