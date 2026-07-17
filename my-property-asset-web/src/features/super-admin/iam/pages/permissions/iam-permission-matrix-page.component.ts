import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { PlatformRole } from '@core/rbac/models/permission.model';
import { ContentSectionComponent, EnterpriseFormPageHeaderComponent, SectionHeaderComponent } from '@shared/ui';

import { SuperAdminPageComponent } from '../../../components/layout';
import {
  IamPermissionCategoriesComponent, IamPermissionComparisonComponent,
  IamPermissionComparisonTableComponent, IamPermissionMatrixViewerComponent,
} from '../../components/permissions';
import { IamSectionNavComponent } from '../../components/shared';
import { PermissionMatrixService } from '../../services/role-admin-store.service';

@Component({
  selector: 'app-iam-permission-matrix-page',
  imports: [
    SuperAdminPageComponent,
    EnterpriseFormPageHeaderComponent,
    ContentSectionComponent,
    SectionHeaderComponent,
    IamSectionNavComponent,
    IamPermissionCategoriesComponent,
    IamPermissionMatrixViewerComponent,
    IamPermissionComparisonComponent,
    IamPermissionComparisonTableComponent,
  ],
  template: `
    <app-sa-page>
      <div class="iam-page">
        <app-enterprise-form-page-header
          eyebrow="Identity & Access"
          title="Permissions"
          subtitle="Visualize the platform permission matrix across roles and resources."
          mode="view"
        />
        <app-iam-section-nav />

        <app-iam-permission-categories [categories]="categories()" [selected]="categoryFilter()"
          (selectedChange)="categoryFilter.set($event)" />

        <app-content-section>
          <app-section-header title="Permission matrix" description="Role × resource access levels from RBAC registry" />
          <app-iam-permission-matrix-viewer [rows]="matrixRows()" />
        </app-content-section>

        <app-content-section>
          <app-section-header title="Permission comparison" description="Compare access levels between two roles" />
          <app-iam-permission-comparison [roleA]="compareRoleA()" [roleB]="compareRoleB()"
            [diffCount]="diffCount()" (roleAChange)="compareRoleA.set($event)" (roleBChange)="compareRoleB.set($event)" />
          <app-iam-permission-comparison-table [items]="comparison()" />
        </app-content-section>
      </div>
    </app-sa-page>
  `,
  styleUrl: './iam-permission-matrix-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IamPermissionMatrixPageComponent {
  private readonly matrixService = inject(PermissionMatrixService);

  readonly categoryFilter = signal('');
  readonly compareRoleA = signal<PlatformRole>('super-admin');
  readonly compareRoleB = signal<PlatformRole>('builder-org-admin');

  readonly categories = computed(() => this.matrixService.getCategories());
  readonly matrixRows = computed(() => this.matrixService.getMatrixRows(this.categoryFilter() || undefined));
  readonly comparison = computed(() => this.matrixService.compareRoles(this.compareRoleA(), this.compareRoleB()));
  readonly diffCount = computed(() => this.comparison().filter((c) => c.differs).length);
}
