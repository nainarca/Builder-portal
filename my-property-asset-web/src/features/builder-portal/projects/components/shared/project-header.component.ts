import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';

import { HasPermissionDirective } from '@core/rbac';
import { ButtonComponent } from '@shared/ui';

import { Project } from '../../models/project.model';
import { ProjectAvatarComponent } from './project-avatar.component';
import { ProjectHealthBadgeComponent } from './project-health-badge.component';
import { ProjectStatusBadgeComponent } from './project-status-badge.component';

@Component({
  selector: 'app-proj-header',
  imports: [
    ButtonComponent,
    HasPermissionDirective,
    ProjectAvatarComponent,
    ProjectStatusBadgeComponent,
    ProjectHealthBadgeComponent,
  ],
  template: `
    <header class="proj-header">
      <div class="proj-header__main">
        <app-proj-avatar [name]="project().name" [thumbnailUrl]="project().thumbnailUrl" size="lg" />
        <div>
          <span class="mpa-eyebrow">{{ project().code }} · {{ project().organizationName }}</span>
          <h1 class="ui-page-title">{{ project().name }}</h1>
          <p class="ui-page-subtitle">{{ project().location.city }}, {{ project().location.state }}</p>
          <div class="proj-header__badges">
            <app-proj-status-badge [status]="project().status" />
            <app-proj-health-badge [health]="project().health" />
          </div>
        </div>
      </div>
      <div class="proj-header__actions">
        <app-button label="Back to list" icon="pi pi-arrow-left" [outlined]="true" (clicked)="goToList()" />
        <app-button label="View units" icon="pi pi-building" [outlined]="true" (clicked)="goToUnits()" />
        @if (!project().archived) {
          <app-button
            *appHasPermission="'id-07-project-unit:contribute'"
            label="Edit"
            icon="pi pi-pencil"
            (clicked)="goToEdit()"
          />
        }
        <ng-content />
      </div>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectHeaderComponent {
  private readonly router = inject(Router);

  readonly project = input.required<Project>();

  goToList(): void {
    void this.router.navigate(['/builder-portal/projects/list']);
  }

  goToEdit(): void {
    void this.router.navigate(['/builder-portal/projects', this.project().id, 'edit']);
  }

  goToUnits(): void {
    void this.router.navigate(['/builder-portal/projects', this.project().id, 'units']);
  }
}
