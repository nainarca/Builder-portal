import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { LoadingManagerService, LoadingScope } from '../../../loading';
import { LoadingSpinnerComponent } from '../../../../shared/ui';

@Component({
  selector: 'app-inline-loading',
  imports: [LoadingSpinnerComponent],
  template: `
    @if (isLoading()) {
      <span class="platform-inline-loading" role="status" aria-live="polite" [attr.aria-label]="label()">
        <app-loading-spinner />
        @if (label()) {
          <span class="platform-inline-loading__label">{{ label() }}</span>
        }
      </span>
    }
    <ng-content />
  `,
  styles: `
    .platform-inline-loading {
      display: inline-flex;
      align-items: center;
      gap: var(--mpa-spacing-sm);
      color: var(--mpa-color-text-muted);
      font-size: var(--mpa-font-size-sm);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InlineLoadingComponent {
  private readonly loadingManager = inject(LoadingManagerService);

  readonly scope = input<LoadingScope>('inline');
  readonly label = input('Loading');

  readonly isLoading = computed(() => this.loadingManager.isLoading(this.scope()));
}
