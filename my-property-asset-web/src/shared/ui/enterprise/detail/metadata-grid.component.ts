import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { CardComponent } from '../../composites/cards/card.component';
import type { EnterpriseDetailFact } from './models/enterprise-detail.models';

/** Responsive metadata / description grid for detail overview sections. */
@Component({
  selector: 'app-enterprise-metadata-grid',
  imports: [CardComponent],
  template: `
    <app-card [variant]="variant()">
      @if (title()) {
        <h3 class="enterprise-metadata-grid__title">{{ title() }}</h3>
      }
      @if (description()) {
        <p class="enterprise-metadata-grid__description">{{ description() }}</p>
      }
      <dl class="enterprise-metadata-grid" [attr.aria-label]="ariaLabel()">
        @for (item of items(); track item.label) {
          <div class="enterprise-metadata-grid__item">
            <dt>{{ item.label }}</dt>
            <dd>{{ item.value }}</dd>
          </div>
        }
      </dl>
      <ng-content />
    </app-card>
  `,
  styles: `
    .enterprise-metadata-grid__title {
      margin: 0 0 var(--mpa-spacing-sm);
      font-size: var(--mpa-font-size-md);
      font-weight: var(--mpa-font-weight-semibold);
    }
    .enterprise-metadata-grid__description {
      margin: 0 0 var(--mpa-spacing-md);
      font-size: var(--mpa-font-size-sm);
      color: var(--mpa-color-text-muted);
    }
    .enterprise-metadata-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
      gap: var(--mpa-spacing-md);
      margin: 0;
    }
    .enterprise-metadata-grid__item dt {
      margin: 0;
      font-size: var(--mpa-font-size-xs);
      color: var(--mpa-color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .enterprise-metadata-grid__item dd {
      margin: 0.2rem 0 0;
      font-size: var(--mpa-font-size-sm);
      font-weight: var(--mpa-font-weight-medium);
      word-break: break-word;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseMetadataGridComponent {
  readonly items = input.required<readonly EnterpriseDetailFact[]>();
  readonly title = input<string | undefined>(undefined);
  readonly description = input<string | undefined>(undefined);
  readonly ariaLabel = input('Record metadata');
  readonly variant = input<'default' | 'flat' | 'outlined'>('outlined');
}
