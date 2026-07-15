import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-unit-badge',
  template: `<span class="unit-badge"><i class="pi pi-tag" aria-hidden="true"></i> {{ label() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnitBadgeComponent {
  readonly label = input.required<string>();
}
