import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AuthorizedButtonComponent, HasPermissionPipe } from '@core/rbac';
import { ContentCardComponent, EnterpriseFormPageHeaderComponent } from '@shared/ui';

import { SuperAdminPageComponent } from './components/layout';

@Component({
  selector: 'app-super-admin-placeholder',
  imports: [
    SuperAdminPageComponent,
    ContentCardComponent,
    EnterpriseFormPageHeaderComponent,
    AuthorizedButtonComponent,
    HasPermissionPipe,
  ],
  template: `
    <app-sa-page>
      <app-enterprise-form-page-header
        eyebrow="Super Admin"
        title="Platform administration"
        subtitle="Govern organizations, builders, and platform configuration from a single control surface."
        mode="view"
      />

      <app-content-card icon="cog">
        <h2 class="mpa-heading-sm m-0">Workspace ready</h2>
        <p class="mpa-body-md m-0">
          This shell is prepared for dashboards, data tables, and administrative workflows with
          enterprise-grade polish.
        </p>

        <div class="super-admin-placeholder__actions">
          <app-authorized-button
            label="Open platform operations"
            icon="cog"
            permission="id-06-platform-operations:full"
          />
          <app-authorized-button
            label="Review builder onboarding"
            icon="building"
            permission="id-02-builder-onboarding:decide"
            [outlined]="true"
          />
        </div>

        @if ('id-06-platform-operations:full' | appHasPermission) {
          <p class="mpa-body-md m-0">You have platform operations access in this session.</p>
        }
      </app-content-card>
    </app-sa-page>
  `,
  styles: `
    .super-admin-placeholder__actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--mpa-spacing-md);
      margin-top: var(--mpa-spacing-lg);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuperAdminPlaceholder {}
