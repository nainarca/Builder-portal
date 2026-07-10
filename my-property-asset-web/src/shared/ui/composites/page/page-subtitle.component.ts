import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-page-subtitle',
  template: `
    <p class="ui-page-subtitle">
      <ng-content>{{ text() }}</ng-content>
    </p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageSubtitleComponent {
  readonly text = input<string | undefined>(undefined);
}
