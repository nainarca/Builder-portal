import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';

import { HasPermissionDirective } from '@core/rbac';
import { ButtonComponent } from '@shared/ui';

import { Building } from '../../models/building.model';
import { BuildingStatusBadgeComponent } from './building-status-badge.component';

@Component({
  selector: 'app-bldg-header',
  imports: [ButtonComponent, HasPermissionDirective, BuildingStatusBadgeComponent],
  template: `
    <header class="bldg-header">
      <div class="bldg-header__main">
        <div>
          <span class="mpa-eyebrow">{{ building().code }} · {{ projectName() }}</span>
          <h1 class="ui-page-title">{{ building().name }}</h1>
          <p class="ui-page-subtitle">
            {{ building().towerName || '—' }}
            @if (building().blockName) {
              · {{ building().blockName }}
            }
          </p>
          <div class="bldg-header__badges">
            <app-bldg-status-badge [status]="building().status" />
          </div>
        </div>
      </div>
      <div class="bldg-header__actions">
        <app-button label="Back to buildings" icon="pi pi-arrow-left" [outlined]="true" (clicked)="goToList()" />
        @if (!building().archived) {
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
  styles: `
    .bldg-header {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.5rem;
    }
    .bldg-header__actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .bldg-header__badges {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuildingHeaderComponent {
  private readonly router = inject(Router);

  readonly building = input.required<Building>();
  readonly projectName = input('Project');

  goToList(): void {
    void this.router.navigate([
      '/builder-portal/projects',
      this.building().projectId,
      'buildings',
    ]);
  }

  goToEdit(): void {
    void this.router.navigate([
      '/builder-portal/projects',
      this.building().projectId,
      'buildings',
      this.building().id,
      'edit',
    ]);
  }
}
