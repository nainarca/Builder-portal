import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { PageWidth } from '../../models';

@Component({
  selector: 'app-feature-page-container',
  template: `<div class="ui-feature-page-container" [class]="widthClass()"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturePageContainerComponent {
  readonly width = input<PageWidth>('default');

  widthClass(): string {
    const width = this.width();
    if (width === 'fluid') {
      return 'ui-feature-page-container--fluid';
    }
    if (width === 'narrow') {
      return 'ui-feature-page-container--narrow';
    }
    if (width === 'wide') {
      return 'ui-feature-page-container--wide';
    }
    return '';
  }
}
