import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ErrorBannerComponent } from '../error-banner/error-banner.component';
import { ErrorDialogHostComponent } from '../error-dialog-host/error-dialog-host.component';
import { GlobalLoadingHostComponent } from '../global-loading-host/global-loading-host.component';
import { InlineNotificationHostComponent } from '../inline-notification-host/inline-notification-host.component';
import { MaintenanceBannerComponent } from '../maintenance-banner/maintenance-banner.component';
import { OfflineBannerComponent } from '../offline-banner/offline-banner.component';
import { PageLoadingIndicatorComponent } from '../page-loading-indicator/page-loading-indicator.component';
import { SessionExpiryHostComponent } from '../session-expiry-host/session-expiry-host.component';
import { SessionRefreshIndicatorComponent } from '../session-refresh-indicator/session-refresh-indicator.component';
import { SystemAnnouncementBannerComponent } from '../system-announcement-banner/system-announcement-banner.component';

@Component({
  selector: 'app-platform-chrome',
  imports: [
    ErrorBannerComponent,
    ErrorDialogHostComponent,
    GlobalLoadingHostComponent,
    InlineNotificationHostComponent,
    MaintenanceBannerComponent,
    OfflineBannerComponent,
    PageLoadingIndicatorComponent,
    SessionExpiryHostComponent,
    SessionRefreshIndicatorComponent,
    SystemAnnouncementBannerComponent,
  ],
  template: `
    <app-page-loading-indicator />
    <app-offline-banner />
    <app-maintenance-banner />
    <app-system-announcement-banner />
    <app-error-banner />
    <app-inline-notification-host />
    <app-global-loading-host />
    <app-error-dialog-host />
    <app-session-expiry-host />
    <app-session-refresh-indicator />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlatformChromeComponent {}
