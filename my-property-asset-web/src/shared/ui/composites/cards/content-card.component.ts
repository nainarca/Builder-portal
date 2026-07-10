import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { IconComponent } from '../../primitives/icon/icon.component';
import { CardComponent } from './card.component';

@Component({
  selector: 'app-content-card',
  imports: [CardComponent, IconComponent],
  template: `
    <app-card [variant]="variant()">
      @if (icon()) {
        <span class="mpa-icon-badge" aria-hidden="true">
          <app-icon [name]="icon()!" size="md" />
        </span>
      }
      <ng-content />
    </app-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentCardComponent {
  readonly icon = input<string | undefined>(undefined);
  readonly variant = input<'default' | 'flat' | 'interactive' | 'outlined'>('default');
}
