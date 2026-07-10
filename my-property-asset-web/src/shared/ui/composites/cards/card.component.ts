import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { CardVariant } from '../../models';

@Component({
  selector: 'app-card',
  template: `<article class="ui-card" [class]="variantClass()"><ng-content /></article>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.ui-card-host--interactive]': "variant() === 'interactive'",
  },
})
export class CardComponent {
  readonly variant = input<CardVariant>('default');

  variantClass(): string {
    const variant = this.variant();
    if (variant === 'flat') {
      return 'ui-card--flat';
    }
    if (variant === 'interactive') {
      return 'ui-card--interactive';
    }
    if (variant === 'outlined') {
      return 'ui-card--outlined';
    }
    return '';
  }
}
