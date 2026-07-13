import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { ContentSectionComponent, SectionHeaderComponent } from '@shared/ui';

import { UserAdminRecord, UserPermissionSummaryItem } from '../../../models/user-admin.model';
import { UserAdminStoreService } from '../../../services/user-admin-store.service';
import { IamPermissionBadgeComponent } from '../../shared';

@Component({
  selector: 'app-iam-user-permission-summary',
  imports: [ContentSectionComponent, SectionHeaderComponent, IamPermissionBadgeComponent],
  template: `
    <app-content-section>
      <app-section-header title="Permission summary" description="Effective permissions from role assignment" />
      <div class="iam-perm-summary">
        @for (group of grouped(); track group.category) {
          <section class="iam-perm-summary__group">
            <h3 class="iam-perm-summary__category">{{ group.category }}</h3>
            <ul class="iam-perm-summary__list">
              @for (p of group.items; track p.resource) {
                <li>
                  <span>{{ p.label }}</span>
                  <app-iam-permission-badge [level]="p.level" />
                </li>
              }
            </ul>
          </section>
        }
      </div>
    </app-content-section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IamUserPermissionSummaryComponent {
  private readonly store = inject(UserAdminStoreService);
  readonly user = input.required<UserAdminRecord>();

  readonly grouped = computed(() => {
    const items = this.store.getPermissionSummary(this.user().primaryRole);
    const map = new Map<string, UserPermissionSummaryItem[]>();
    for (const item of items) {
      const list = map.get(item.category) ?? [];
      list.push(item);
      map.set(item.category, list);
    }
    return [...map.entries()].map(([category, groupItems]) => ({ category, items: groupItems }));
  });
}
