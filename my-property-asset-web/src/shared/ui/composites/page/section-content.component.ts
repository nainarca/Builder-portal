import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-section-content',
  template: `<div class="ui-section-content"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionContentComponent {}
