import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { ButtonComponent } from '../../primitives/button/button.component';
import { CardComponent } from './card.component';

@Component({
  selector: 'app-action-card',
  imports: [ButtonComponent, CardComponent],
  template: `
    <app-card variant="interactive">
      <button type="button" class="ui-action-card__button" (click)="selected.emit()">
        <h3 class="mpa-heading-sm m-0">{{ title() }}</h3>
        @if (description()) {
          <p class="mpa-body-md m-0">{{ description() }}</p>
        }
      </button>
      @if (actionLabel()) {
        <app-button [label]="actionLabel()!" [text]="true" (clicked)="action.emit($event)" />
      }
      <ng-content />
    </app-card>
  `,
  styles: `
    .ui-action-card__button {
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-sm);
      width: 100%;
      padding: 0;
      border: 0;
      background: transparent;
      text-align: left;
      color: inherit;
      cursor: pointer;
    }

    .ui-action-card__button:focus-visible {
      outline: 2px solid var(--mpa-color-focus);
      outline-offset: 2px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionCardComponent {
  readonly title = input.required<string>();
  readonly description = input<string | undefined>(undefined);
  readonly actionLabel = input<string | undefined>(undefined);

  readonly selected = output<void>();
  readonly action = output<MouseEvent>();
}
