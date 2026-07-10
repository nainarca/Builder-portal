import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-page-title',
  template: `
    <h1 class="ui-page-title">
      <ng-content>{{ text() }}</ng-content>
    </h1>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageTitleComponent {
  readonly text = input<string | undefined>(undefined);
}
