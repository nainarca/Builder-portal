import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface BuilderInfoItem {
  readonly label: string;
  readonly value: string;
}

@Component({
  selector: 'app-bldr-info-panel',
  template: `
    <section class="bldr-info-panel" [attr.aria-label]="title()">
      <h2 class="bldr-info-panel__title">{{ title() }}</h2>
      <dl class="bldr-info-panel__list">
        @for (item of items(); track item.label) {
          <div class="bldr-info-panel__row">
            <dt>{{ item.label }}</dt>
            <dd>{{ item.value }}</dd>
          </div>
        }
      </dl>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderInfoPanelComponent {
  readonly title = input('Builder information');
  readonly items = input<BuilderInfoItem[]>([]);
}
