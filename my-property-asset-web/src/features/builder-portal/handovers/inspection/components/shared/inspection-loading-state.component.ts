import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { SkeletonComponent } from '@shared/ui';

@Component({
  selector: 'app-inspection-loading-state',
  imports: [SkeletonComponent],
  template: `
    <div class="insp-loading-state" role="status" aria-live="polite">
      @for (row of rows(); track row) {
        <app-skeleton height="4.5rem" borderRadius="var(--mpa-radius-lg)" />
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InspectionLoadingStateComponent {
  readonly count = input(3);

  readonly rows = computed(() => Array.from({ length: this.count() }, (_, i) => i));
}
