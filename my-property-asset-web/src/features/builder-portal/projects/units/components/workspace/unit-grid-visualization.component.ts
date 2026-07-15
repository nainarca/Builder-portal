import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Unit } from '../../models/unit.model';

interface FloorRow {
  readonly floorNumber: number;
  readonly units: readonly Unit[];
}

@Component({
  selector: 'app-unit-grid-visualization',
  imports: [RouterLink],
  template: `
    <div class="unit-grid-viz">
      @for (row of floorRows(); track row.floorNumber) {
        <div class="unit-grid-viz__row">
          <span class="unit-grid-viz__row-label">Floor {{ row.floorNumber }}</span>
          <div class="unit-grid-viz__tiles">
            @for (unit of row.units; track unit.id) {
              <a
                class="unit-grid-viz__tile"
                [class]="'unit-grid-viz__tile--' + unit.status"
                [routerLink]="['/builder-portal/projects', projectId(), 'units', unit.id]"
                [attr.title]="unit.unitNumber + ' — ' + unit.status"
              >
                {{ unit.unitNumber.slice(-3) }}
              </a>
            }
          </div>
        </div>
      }
    </div>
    <div class="unit-grid-viz__legend">
      <span><span class="unit-grid-viz__legend-swatch" style="background: color-mix(in srgb, var(--mpa-color-info) 40%, transparent)"></span>Available</span>
      <span><span class="unit-grid-viz__legend-swatch" style="background: color-mix(in srgb, var(--mpa-color-warning) 40%, transparent)"></span>Reserved</span>
      <span><span class="unit-grid-viz__legend-swatch" style="background: color-mix(in srgb, var(--mpa-color-success) 40%, transparent)"></span>Sold</span>
      <span><span class="unit-grid-viz__legend-swatch" style="background: var(--mpa-color-surface-muted)"></span>Blocked</span>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnitGridVisualizationComponent {
  readonly units = input.required<readonly Unit[]>();
  readonly projectId = input.required<string>();

  readonly floorRows = computed<readonly FloorRow[]>(() => {
    const byFloor = new Map<number, Unit[]>();
    for (const unit of this.units()) {
      const list = byFloor.get(unit.floorNumber) ?? [];
      list.push(unit);
      byFloor.set(unit.floorNumber, list);
    }
    return [...byFloor.entries()]
      .sort(([a], [b]) => b - a)
      .map(([floorNumber, units]) => ({ floorNumber, units }));
  });
}
