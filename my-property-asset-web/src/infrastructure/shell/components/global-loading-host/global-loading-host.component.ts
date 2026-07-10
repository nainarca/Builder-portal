import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { GlobalLoadingService, LoadingManagerService } from '@infrastructure/loading';
import { LoadingSpinnerComponent } from '@shared/ui';

@Component({
  selector: 'app-global-loading-host',
  imports: [LoadingSpinnerComponent],
  template: `
    @if (isGlobalLoading()) {
      <div class="platform-global-loading" role="status" aria-live="polite" aria-label="Loading">
        <app-loading-spinner />
      </div>
    }
  `,
  styleUrl: '../../styles/_platform-shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalLoadingHostComponent {
  private readonly globalLoading = inject(GlobalLoadingService);
  private readonly loadingManager = inject(LoadingManagerService);

  readonly isGlobalLoading = () =>
    this.globalLoading.isLoading() || this.loadingManager.globalLoading();
}
