import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { OnlineStatusMonitorService } from '../../../network';

@Component({
  selector: 'app-offline-banner',
  template: `
    @if (!onlineStatus.isOnline()) {
      <div class="platform-banner platform-banner--offline" role="status" aria-live="polite">
        <div class="platform-banner__content">
          <strong class="platform-banner__title">You are offline</strong>
          <span class="platform-banner__message">
            Some features may be unavailable until your connection is restored.
          </span>
        </div>
      </div>
    }
  `,
  styleUrl: '../../styles/_platform-shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfflineBannerComponent {
  readonly onlineStatus = inject(OnlineStatusMonitorService);
}
