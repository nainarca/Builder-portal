import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { SystemAnnouncementService } from '../../../maintenance';
import { ButtonComponent } from '../../../../shared/ui';

@Component({
  selector: 'app-system-announcement-banner',
  imports: [ButtonComponent],
  template: `
    @if (announcementService.activeAnnouncement(); as announcement) {
      <div
        class="platform-banner"
        [class]="announcementClass(announcement.level)"
        role="status"
        aria-live="polite"
      >
        <div class="platform-banner__content">
          <strong class="platform-banner__title">{{ announcement.title }}</strong>
          <span class="platform-banner__message">{{ announcement.message }}</span>
        </div>
        @if (announcement.dismissible) {
          <app-button
            icon="pi pi-times"
            size="small"
            [text]="true"
            ariaLabel="Dismiss announcement"
            (clicked)="announcementService.dismiss(announcement.id)"
          />
        }
      </div>
    }
  `,
  styleUrl: '../../styles/_platform-shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SystemAnnouncementBannerComponent {
  readonly announcementService = inject(SystemAnnouncementService);

  announcementClass(level: 'info' | 'warning' | 'critical'): string {
    return `platform-banner--announcement-${level}`;
  }
}
