import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-iam-info-panel',
  template: `
    <section class="iam-info-panel" [attr.aria-label]="title()">
      <h2 class="iam-info-panel__title">{{ title() }}</h2>
      <dl class="iam-info-panel__list">
        @for (item of items(); track item.label) {
          <div class="iam-info-panel__row">
            <dt>{{ item.label }}</dt>
            <dd>{{ item.value }}</dd>
          </div>
        }
      </dl>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IamInfoPanelComponent {
  readonly title = input.required<string>();
  readonly items = input.required<readonly { label: string; value: string }[]>();
}
