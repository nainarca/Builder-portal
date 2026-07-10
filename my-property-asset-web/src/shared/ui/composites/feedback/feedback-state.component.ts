import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { ButtonComponent } from '../../primitives/button/button.component';
import { IconComponent } from '../../primitives/icon/icon.component';

@Component({
  selector: 'app-feedback-state',
  template: `
    <div class="ui-feedback-state" role="status">
      @if (icon()) {
        <span class="mpa-icon-badge" aria-hidden="true">
          <app-icon [name]="icon()!" size="lg" />
        </span>
      }
      <h2 class="ui-feedback-state__title">{{ title() }}</h2>
      @if (description()) {
        <p class="ui-feedback-state__description">{{ description() }}</p>
      }
      @if (actionLabel()) {
        <app-button [label]="actionLabel()!" (clicked)="action.emit($event)" />
      }
      <ng-content />
    </div>
  `,
  imports: [ButtonComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackStateComponent {
  readonly title = input.required<string>();
  readonly description = input<string | undefined>(undefined);
  readonly icon = input<string | undefined>(undefined);
  readonly actionLabel = input<string | undefined>(undefined);

  readonly action = output<MouseEvent>();
}
