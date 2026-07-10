import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { PageSubtitleComponent } from './page-subtitle.component';
import { PageTitleComponent } from './page-title.component';

@Component({
  selector: 'app-page-header',
  imports: [PageSubtitleComponent, PageTitleComponent],
  template: `
    <header class="ui-page-header">
      <div class="ui-page-header__main">
        @if (eyebrow()) {
          <span class="mpa-eyebrow">{{ eyebrow() }}</span>
        }
        <ng-content select="app-page-title,[pageTitle]" />
        <ng-content select="app-page-subtitle,[pageSubtitle]" />
        @if (title()) {
          <app-page-title [text]="title()!" />
        }
        @if (description()) {
          <app-page-subtitle [text]="description()!" />
        }
      </div>
      <div class="ui-page-header__aside">
        <ng-content select="app-page-actions,[pageActions]" />
      </div>
      <ng-content select="app-page-toolbar,[pageToolbar]" />
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeaderComponent {
  readonly title = input<string | undefined>(undefined);
  readonly description = input<string | undefined>(undefined);
  readonly eyebrow = input<string | undefined>(undefined);
}
