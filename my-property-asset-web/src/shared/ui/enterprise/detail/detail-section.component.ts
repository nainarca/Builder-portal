import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { CardComponent } from '../../composites/cards/card.component';

/** Section card chrome for detail content blocks. */
@Component({
  selector: 'app-enterprise-detail-section',
  imports: [CardComponent],
  template: `
    <section class="enterprise-detail-section" [attr.aria-labelledby]="headingId()">
      <app-card [variant]="variant()">
        <div class="enterprise-detail-section__header">
          <div>
            <h2 class="enterprise-detail-section__title" [id]="headingId()">{{ title() }}</h2>
            @if (description()) {
              <p class="enterprise-detail-section__description">{{ description() }}</p>
            }
          </div>
          <div class="enterprise-detail-section__actions">
            <ng-content select="[sectionActions]" />
          </div>
        </div>
        <div class="enterprise-detail-section__body">
          <ng-content />
        </div>
      </app-card>
    </section>
  `,
  styles: `
    .enterprise-detail-section__header {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      justify-content: space-between;
      gap: var(--mpa-spacing-sm);
      margin-bottom: var(--mpa-spacing-md);
    }
    .enterprise-detail-section__title {
      margin: 0;
      font-size: var(--mpa-font-size-lg);
      font-weight: var(--mpa-font-weight-semibold);
    }
    .enterprise-detail-section__description {
      margin: var(--mpa-spacing-xs) 0 0;
      font-size: var(--mpa-font-size-sm);
      color: var(--mpa-color-text-muted);
    }
    .enterprise-detail-section__actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--mpa-spacing-sm);
    }
    .enterprise-detail-section__actions:empty {
      display: none;
    }
    .enterprise-detail-section__body {
      min-width: 0;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseDetailSectionComponent {
  readonly title = input.required<string>();
  readonly description = input<string | undefined>(undefined);
  readonly variant = input<'default' | 'flat' | 'outlined'>('default');
  readonly headingId = input('detail-section');
}
