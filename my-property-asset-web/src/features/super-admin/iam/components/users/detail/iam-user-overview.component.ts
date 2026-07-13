import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ContentCardComponent, ContentSectionComponent, SectionHeaderComponent } from '@shared/ui';

import { UserAdminRecord } from '../../../models/user-admin.model';
import { IamInfoPanelComponent, IamRoleBadgeComponent, IamStatisticsCardsComponent } from '../../shared';

@Component({
  selector: 'app-iam-user-overview',
  imports: [
    RouterLink, ContentSectionComponent, SectionHeaderComponent, ContentCardComponent,
    IamInfoPanelComponent, IamStatisticsCardsComponent, IamRoleBadgeComponent,
  ],
  template: `
    <div class="iam-overview">
      <app-iam-statistics-cards [stats]="stats()" />
      <div class="iam-overview__grid">
        <app-iam-info-panel title="Profile information" [items]="profileItems()" />
        <app-iam-info-panel title="Membership" [items]="membershipItems()" />
      </div>
      <app-content-section>
        <app-section-header title="Role summary" description="Primary platform role assignment" />
        <app-content-card icon="shield">
          <app-iam-role-badge [role]="user().primaryRole" />
          <p class="iam-overview__perm-count">{{ user().permissionCount }} effective permissions</p>
        </app-content-card>
      </app-content-section>
      @if (user().organizationId) {
        <app-content-section>
          <app-section-header title="Organization link" />
          <app-content-card icon="sitemap">
            <a [routerLink]="['/super-admin/organizations', user().organizationId]">{{ user().organizationName }}</a>
          </app-content-card>
        </app-content-section>
      }
      @if (user().builderId) {
        <app-content-section>
          <app-section-header title="Builder link" />
          <app-content-card icon="building">
            <a [routerLink]="['/super-admin/builders', user().builderId]">{{ user().builderName }}</a>
          </app-content-card>
        </app-content-section>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IamUserOverviewComponent {
  readonly user = input.required<UserAdminRecord>();

  readonly stats = computed(() => [
    { label: 'Permissions', value: String(this.user().permissionCount), icon: 'pi pi-lock' },
    { label: 'Sessions', value: String(this.user().sessionCount), icon: 'pi pi-desktop' },
    { label: 'Memberships', value: String(this.user().memberships.length), icon: 'pi pi-sitemap' },
    { label: 'MFA', value: this.user().mfaEnabled ? 'On' : 'Off', icon: 'pi pi-shield' },
  ]);

  readonly profileItems = computed(() => {
    const u = this.user();
    return [
      { label: 'Display name', value: u.displayName },
      { label: 'Email', value: u.email },
      { label: 'Status', value: u.status },
      { label: 'Email verified', value: u.emailVerified ? 'Yes' : 'No' },
      { label: 'Created', value: new Date(u.createdAt).toLocaleDateString() },
    ];
  });

  readonly membershipItems = computed(() => {
    const u = this.user();
    if (!u.memberships.length) return [{ label: 'Memberships', value: 'None' }];
    return u.memberships.map((m) => ({
      label: m.organizationName,
      value: `${m.role} (${m.organizationType})`,
    }));
  });
}
