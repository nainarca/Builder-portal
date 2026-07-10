import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { MaintenanceService } from '../../../maintenance';

@Component({
  selector: 'app-maintenance-banner',
  template: `
    @if (maintenanceService.maintenance().enabled) {
      <div class="platform-banner platform-banner--maintenance" role="status" aria-live="polite">
        <div class="platform-banner__content">
          <strong class="platform-banner__title">{{ maintenanceService.maintenance().title }}</strong>
          <span class="platform-banner__message">{{ maintenanceService.maintenance().message }}</span>
          @if (maintenanceService.maintenance().estimatedReturn) {
            <span class="platform-banner__message">
              Estimated return: {{ maintenanceService.maintenance().estimatedReturn }}
            </span>
          }
        </div>
      </div>
    }
  `,
  styleUrl: '../../styles/_platform-shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaintenanceBannerComponent {
  readonly maintenanceService = inject(MaintenanceService);
}
