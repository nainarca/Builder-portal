import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { StatusBadgeComponent } from '@shared/ui';

import { BUILDING_STATUS_LABELS } from '../../config/buildings.config';
import { BuildingStatus } from '../../models/building.model';

@Component({
  selector: 'app-bldg-status-badge',
  imports: [StatusBadgeComponent],
  template: `<app-status-badge [label]="label()" [severity]="severity()" [icon]="icon()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuildingStatusBadgeComponent {
  readonly status = input.required<BuildingStatus>();

  readonly label = computed(() => BUILDING_STATUS_LABELS[this.status()] ?? this.status());

  readonly severity = computed(() => {
    const map: Record<BuildingStatus, 'success' | 'warn' | 'danger' | 'info' | 'secondary'> = {
      planning: 'info',
      construction: 'warn',
      completed: 'success',
      archived: 'danger',
    };
    return map[this.status()];
  });

  readonly icon = computed(() => {
    const map: Record<BuildingStatus, string> = {
      planning: 'pi pi-map',
      construction: 'pi pi-hammer',
      completed: 'pi pi-check-circle',
      archived: 'pi pi-inbox',
    };
    return map[this.status()];
  });
}
