import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { Tower, Unit } from '../../models/unit.model';
import { TowerCardComponent } from '../shared/tower-card.component';

interface TowerSummary {
  readonly tower: Tower;
  readonly unitCount: number;
  readonly avgProgress: number;
  readonly soldCount: number;
}

@Component({
  selector: 'app-tower-overview',
  imports: [TowerCardComponent],
  template: `
    <div class="unit-tower-overview">
      @for (summary of summaries(); track summary.tower.id) {
        <app-tower-card
          [name]="summary.tower.name"
          [totalFloors]="summary.tower.totalFloors"
          [unitCount]="summary.unitCount"
          [avgProgress]="summary.avgProgress"
          [soldCount]="summary.soldCount"
        />
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TowerOverviewComponent {
  readonly towers = input.required<readonly Tower[]>();
  readonly units = input.required<readonly Unit[]>();

  readonly summaries = computed<readonly TowerSummary[]>(() =>
    this.towers().map((tower) => {
      const towerUnits = this.units().filter((unit) => unit.towerId === tower.id);
      const unitCount = towerUnits.length;
      const avgProgress = unitCount
        ? Math.round(towerUnits.reduce((sum, unit) => sum + unit.progress, 0) / unitCount)
        : 0;
      const soldCount = towerUnits.filter((unit) => unit.status === 'sold').length;
      return { tower, unitCount, avgProgress, soldCount };
    }),
  );
}
