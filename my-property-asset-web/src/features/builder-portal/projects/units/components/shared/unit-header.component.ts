import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';

import { HasPermissionDirective } from '@core/rbac';
import { ButtonComponent } from '@shared/ui';

import { Unit } from '../../models/unit.model';
import { UnitAvatarComponent } from './unit-avatar.component';
import { UnitConstructionBadgeComponent } from './unit-construction-badge.component';
import { UnitStatusBadgeComponent } from './unit-status-badge.component';

@Component({
  selector: 'app-unit-header',
  imports: [ButtonComponent, HasPermissionDirective, UnitAvatarComponent, UnitStatusBadgeComponent, UnitConstructionBadgeComponent],
  template: `
    <header class="unit-header">
      <div class="unit-header__main">
        <app-unit-avatar [unitNumber]="unit().unitNumber" size="lg" />
        <div>
          <span class="mpa-eyebrow">{{ unit().towerName }} · Floor {{ unit().floorNumber }}</span>
          <h1 class="ui-page-title">{{ unit().unitNumber }}</h1>
          <p class="ui-page-subtitle">{{ unit().configuration }} · {{ unit().areaSqft }} sqft</p>
          <div class="unit-header__badges">
            <app-unit-status-badge [status]="unit().status" />
            <app-unit-construction-badge [stage]="unit().constructionStage" />
          </div>
        </div>
      </div>
      <div class="unit-header__actions">
        <app-button label="Back to units" icon="pi pi-arrow-left" [outlined]="true" (clicked)="goToList()" />
        @if (!unit().archived) {
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
export class UnitHeaderComponent {
  private readonly router = inject(Router);

  readonly unit = input.required<Unit>();
  readonly projectId = input.required<string>();

  goToList(): void {
    void this.router.navigate(['/builder-portal/projects', this.projectId(), 'units']);
  }

  goToEdit(): void {
    void this.router.navigate(['/builder-portal/projects', this.projectId(), 'units', this.unit().id, 'edit']);
  }
}
