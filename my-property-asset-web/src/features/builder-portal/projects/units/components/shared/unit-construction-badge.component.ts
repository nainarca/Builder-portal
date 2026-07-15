import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { StatusBadgeComponent } from '@shared/ui';

import { UnitConstructionStage } from '../../models/unit.model';

@Component({
  selector: 'app-unit-construction-badge',
  imports: [StatusBadgeComponent],
  template: `<app-status-badge [label]="label()" [severity]="severity()" [icon]="icon()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnitConstructionBadgeComponent {
  readonly stage = input.required<UnitConstructionStage>();

  readonly label = computed(() => {
    const map: Record<UnitConstructionStage, string> = {
      'not-started': 'Not started',
      foundation: 'Foundation',
      structure: 'Structure',
      finishing: 'Finishing',
      'ready-for-handover': 'Ready for handover',
      'handed-over': 'Handed over',
    };
    return map[this.stage()];
  });

  readonly severity = computed(() => {
    const map: Record<UnitConstructionStage, 'success' | 'warn' | 'danger' | 'info' | 'secondary'> = {
      'not-started': 'secondary',
      foundation: 'secondary',
      structure: 'info',
      finishing: 'info',
      'ready-for-handover': 'warn',
      'handed-over': 'success',
    };
    return map[this.stage()];
  });

  readonly icon = computed(() => {
    const map: Record<UnitConstructionStage, string> = {
      'not-started': 'pi pi-hourglass',
      foundation: 'pi pi-stop-circle',
      structure: 'pi pi-building',
      finishing: 'pi pi-palette',
      'ready-for-handover': 'pi pi-key',
      'handed-over': 'pi pi-check-circle',
    };
    return map[this.stage()];
  });
}
