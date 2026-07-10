import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { FormLayout } from '../../models';

@Component({
  selector: 'app-form-container',
  template: `<form class="ui-form-container" [class]="layoutClass()" novalidate><ng-content /></form>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormContainerComponent {
  readonly layout = input<FormLayout>('vertical');

  layoutClass(): string {
    const layout = this.layout();
    return layout === 'horizontal'
      ? 'ui-form-container--horizontal'
      : layout === 'inline'
        ? 'ui-form-container--inline'
        : '';
  }
}
