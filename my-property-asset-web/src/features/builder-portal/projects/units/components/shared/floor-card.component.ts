import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-floor-card',
  template: `
    <div class="unit-floor-card">
      <p class="unit-floor-card__label">Floor {{ floorNumber() }}</p>
      <span class="unit-floor-card__count">{{ unitCount() }} units</span>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FloorCardComponent {
  readonly floorNumber = input.required<number>();
  readonly unitCount = input(0);
}
