import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { ButtonComponent } from '../../primitives/button/button.component';
import { IconComponent } from '../../primitives/icon/icon.component';
import { CardComponent } from './card.component';

@Component({
  selector: 'app-empty-card',
  imports: [ButtonComponent, CardComponent, IconComponent],
  template: `
    <app-card variant="flat">
      <div class="ui-feedback-state ui-feedback-state--compact">
        @if (icon()) {
          <span class="mpa-icon-badge" aria-hidden="true">
            <app-icon [name]="icon()!" size="lg" />
          </span>
        }
        <h3 class="ui-feedback-state__title">{{ title() }}</h3>
        @if (description()) {
          <p class="ui-feedback-state__description">{{ description() }}</p>
        }
        @if (actionLabel()) {
          <app-button [label]="actionLabel()!" (clicked)="action.emit($event)" />
        }
        <ng-content />
      </div>
    </app-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyCardComponent {
  readonly title = input.required<string>();
  readonly description = input<string | undefined>(undefined);
  readonly icon = input<string | undefined>('inbox');
  readonly actionLabel = input<string | undefined>(undefined);

  readonly action = output<MouseEvent>();
}
