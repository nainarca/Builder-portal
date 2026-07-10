import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { LoadingManagerService, LoadingScope } from '../../../loading';
import { LoadingSpinnerComponent, SkeletonComponent } from '../../../../shared/ui';

@Component({
  selector: 'app-section-loading',
  imports: [LoadingSpinnerComponent, SkeletonComponent],
  template: `
    @if (isLoading()) {
      <div class="platform-section-loading" role="status" aria-live="polite">
        @if (useSkeleton()) {
          <app-skeleton height="1rem" />
          <app-skeleton height="1rem" width="80%" />
          <app-skeleton height="1rem" width="60%" />
        } @else {
          <app-loading-spinner />
        }
      </div>
    } @else {
      <ng-content />
    }
  `,
  styles: `
    .platform-section-loading {
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-sm);
      padding: var(--mpa-spacing-lg);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-lg);
      background: var(--mpa-color-surface-muted);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionLoadingComponent {
  private readonly loadingManager = inject(LoadingManagerService);

  readonly scope = input<LoadingScope>('section');
  readonly useSkeleton = input(true);

  readonly isLoading = computed(() => this.loadingManager.isLoading(this.scope()));
}
