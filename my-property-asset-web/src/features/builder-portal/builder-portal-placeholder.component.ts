import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AuthorizedButtonComponent, HasPermissionPipe } from '@core/rbac';
import { BasePageComponent, ContentCardComponent, PageHeaderComponent } from '@shared/ui';

@Component({
  selector: 'app-builder-portal-placeholder',
  imports: [
    BasePageComponent,
    ContentCardComponent,
    PageHeaderComponent,
    AuthorizedButtonComponent,
    HasPermissionPipe,
  ],
  template: `
    <app-base-page>
      <app-page-header
        eyebrow="Builder Portal"
        title="Project delivery workspace"
        description="Coordinate developments, assets, and stakeholders with a focused builder experience."
      />

      <app-content-card icon="building">
        <h2 class="mpa-heading-sm m-0">Workspace ready</h2>
        <p class="mpa-body-md m-0">
          Builder workflows, project views, and collaboration tools will be introduced here with
          consistent design language.
        </p>

        <div class="builder-portal-placeholder__actions">
          <app-authorized-button
            label="Create project"
            icon="plus"
            permission="id-07-project-unit:contribute"
          />
          <app-authorized-button
            label="Manage organization"
            icon="sliders-h"
            permission="id-03-organization-tenancy:operate"
            [outlined]="true"
          />
        </div>

        @if ('id-07-project-unit:read' | appHasPermission) {
          <p class="mpa-body-md m-0">You can view project and unit information in this workspace.</p>
        }
      </app-content-card>
    </app-base-page>
  `,
  styles: `
    .builder-portal-placeholder__actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--mpa-spacing-md);
      margin-top: var(--mpa-spacing-lg);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderPortalPlaceholder {}
