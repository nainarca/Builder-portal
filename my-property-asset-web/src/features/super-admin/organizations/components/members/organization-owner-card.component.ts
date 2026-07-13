import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { StatusBadgeComponent } from '@shared/ui';

import { OrganizationMemberRecord } from '../../models/organization-admin.model';

@Component({
  selector: 'app-org-owner-card',
  imports: [TitleCasePipe, StatusBadgeComponent],
  template: `
    @if (owner(); as member) {
      <article class="org-owner-card">
        <span class="org-owner-card__label">Organization owner</span>
        <h3 class="org-owner-card__name">{{ member.name }}</h3>
        <p class="org-owner-card__email">{{ member.email }}</p>
        <app-status-badge [label]="member.role | titlecase" severity="info" />
      </article>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationOwnerCardComponent {
  readonly members = input.required<readonly OrganizationMemberRecord[]>();

  readonly owner = computed(() =>
    this.members().find((m) => m.role.includes('owner')) ?? this.members()[0],
  );
}
