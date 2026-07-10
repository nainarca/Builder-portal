import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { LoadingManagerService } from '@infrastructure/loading';

@Component({
  selector: 'app-page-loading-indicator',
  template: `
    @if (loadingManager.pageLoading()) {
      <div class="platform-page-loading" role="progressbar" aria-label="Loading page">
        <div class="platform-page-loading__bar"></div>
      </div>
    }
  `,
  styleUrl: '../../styles/_platform-shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageLoadingIndicatorComponent {
  readonly loadingManager = inject(LoadingManagerService);
}
