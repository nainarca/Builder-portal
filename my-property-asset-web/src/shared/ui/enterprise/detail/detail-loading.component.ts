import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { SkeletonComponent } from '../../primitives/skeleton/skeleton.component';
import { SkeletonCardComponent } from '../loading/enterprise-loading.component';

/** Detail loading skeletons — hero, cards, timeline, related lists. */
@Component({
  selector: 'app-enterprise-detail-loading',
  imports: [SkeletonComponent, SkeletonCardComponent],
  template: `
    <div class="enterprise-detail-loading" role="status" [attr.aria-label]="ariaLabel()">
      @if (showHero()) {
        <div class="enterprise-detail-loading__hero">
          <app-skeleton width="4rem" height="4rem" borderRadius="var(--mpa-radius-xl)" />
          <div class="enterprise-detail-loading__hero-text">
            <app-skeleton width="30%" height="0.75rem" />
            <app-skeleton width="55%" height="1.75rem" />
            <app-skeleton width="40%" height="0.75rem" />
          </div>
        </div>
      }
      @if (showCards()) {
        <div class="enterprise-detail-loading__cards">
          @for (_ of cardSlots; track $index) {
            <app-skeleton-card />
          }
        </div>
      }
      @if (showTimeline()) {
        <div class="enterprise-detail-loading__timeline">
          @for (_ of [0, 1, 2, 3]; track $index) {
            <div class="enterprise-detail-loading__timeline-row">
              <app-skeleton width="1.25rem" height="1.25rem" borderRadius="999px" />
              <app-skeleton width="70%" height="1rem" />
            </div>
          }
        </div>
      }
      @if (showRelated()) {
        <div class="enterprise-detail-loading__related">
          <app-skeleton width="40%" height="1.25rem" />
          @for (_ of [0, 1, 2]; track $index) {
            <app-skeleton width="100%" height="2.5rem" />
          }
        </div>
      }
    </div>
  `,
  styles: `
    .enterprise-detail-loading {
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-lg);
    }
    .enterprise-detail-loading__hero {
      display: flex;
      gap: var(--mpa-spacing-lg);
      padding: var(--mpa-spacing-lg);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-lg);
    }
    .enterprise-detail-loading__hero-text {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-sm);
    }
    .enterprise-detail-loading__cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
      gap: var(--mpa-spacing-md);
    }
    .enterprise-detail-loading__timeline,
    .enterprise-detail-loading__related {
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-sm);
    }
    .enterprise-detail-loading__timeline-row {
      display: flex;
      align-items: center;
      gap: var(--mpa-spacing-sm);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseDetailLoadingComponent {
  readonly showHero = input(true);
  readonly showCards = input(true);
  readonly showTimeline = input(false);
  readonly showRelated = input(false);
  readonly cardCount = input(3);
  readonly ariaLabel = input('Loading detail');

  get cardSlots(): number[] {
    return Array.from({ length: this.cardCount() }, (_, i) => i);
  }
}
