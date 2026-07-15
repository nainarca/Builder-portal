import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-tower-card',
  template: `
    <article class="unit-tower-card">
      <p class="unit-tower-card__name">{{ name() }}</p>
      <p class="unit-tower-card__meta">{{ totalFloors() }} floors · {{ unitCount() }} units</p>
      <div class="unit-tower-card__bar" role="progressbar" [attr.aria-valuenow]="avgProgress()" aria-valuemin="0" aria-valuemax="100">
        <div class="unit-tower-card__bar-fill" [style.width.%]="avgProgress()"></div>
      </div>
      <div class="unit-tower-card__footer">
        <span>{{ avgProgress() }}% avg. progress</span>
        <span>{{ soldCount() }} sold</span>
      </div>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TowerCardComponent {
  readonly name = input.required<string>();
  readonly totalFloors = input.required<number>();
  readonly unitCount = input(0);
  readonly avgProgress = input(0);
  readonly soldCount = input(0);
}
