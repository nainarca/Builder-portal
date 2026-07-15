import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { SelectComponent, SelectOption } from '@shared/ui';

import { Tower } from '../../models/unit.model';

@Component({
  selector: 'app-tower-floor-selector',
  imports: [SelectComponent],
  template: `
    <div class="unit-tower-floor-selector">
      <div class="unit-tower-floor-selector__field">
        <span>Tower / Block</span>
        <app-select [options]="towerOptions()" [value]="towerId()" ariaLabel="Tower" (valueChange)="towerChange.emit($event)" />
      </div>
      <div class="unit-tower-floor-selector__field">
        <span>Floor</span>
        <app-select [options]="floorOptions()" [value]="floorValue()" ariaLabel="Floor" (valueChange)="onFloorChange($event)" />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TowerFloorSelectorComponent {
  readonly towers = input.required<readonly Tower[]>();
  readonly floors = input.required<readonly number[]>();
  readonly towerId = input('');
  readonly floorNumber = input<number | 'all'>('all');

  readonly towerChange = output<string>();
  readonly floorChange = output<number | 'all'>();

  towerOptions(): readonly SelectOption[] {
    return [{ label: 'All towers', value: '' }, ...this.towers().map((t) => ({ label: t.name, value: t.id }))];
  }

  floorOptions(): readonly SelectOption[] {
    return [
      { label: 'All floors', value: 'all' },
      ...this.floors().map((f) => ({ label: `Floor ${f}`, value: String(f) })),
    ];
  }

  floorValue(): string {
    return this.floorNumber() === 'all' ? 'all' : String(this.floorNumber());
  }

  onFloorChange(value: string): void {
    this.floorChange.emit(value === 'all' ? 'all' : Number(value));
  }
}
