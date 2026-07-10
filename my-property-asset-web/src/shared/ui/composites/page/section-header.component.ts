import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-section-header',
  template: `
    <header class="ui-section-header">
      <div>
        <h2 class="ui-section-header__title">
          <ng-content select="[sectionTitle]" />
          {{ title() }}
        </h2>
        @if (description()) {
          <p class="ui-section-header__description">{{ description() }}</p>
        }
      </div>
      <ng-content select="[sectionActions]" />
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionHeaderComponent {
  readonly title = input<string | undefined>(undefined);
  readonly description = input<string | undefined>(undefined);
}
