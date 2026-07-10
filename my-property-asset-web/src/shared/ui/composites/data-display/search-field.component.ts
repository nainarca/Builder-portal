import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { IconComponent } from '../../primitives/icon/icon.component';
import { InputTextComponent } from '../../primitives/input-text/input-text.component';

@Component({
  selector: 'app-search-field',
  imports: [IconComponent, InputTextComponent],
  template: `
    <div class="ui-search-field">
      <span class="ui-search-field__icon" aria-hidden="true">
        <app-icon name="search" size="sm" />
      </span>
      <app-input-text
        type="search"
        [value]="value()"
        [placeholder]="placeholder()"
        [ariaLabel]="ariaLabel()"
        (valueChange)="valueChange.emit($event)"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFieldComponent {
  readonly value = input('');
  readonly placeholder = input('Search');
  readonly ariaLabel = input('Search');

  readonly valueChange = output<string>();
}
