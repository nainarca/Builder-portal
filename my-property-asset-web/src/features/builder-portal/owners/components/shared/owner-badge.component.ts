import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-owner-badge',
  template: `<span class="owner-badge"><i class="pi pi-map-marker" aria-hidden="true"></i> {{ label() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerBadgeComponent {
  readonly label = input.required<string>();
}
