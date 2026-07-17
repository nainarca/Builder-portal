import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { NavigationDrawerComponent, NavigationOverlayComponent } from '../../navigation/components';
import { PlatformChromeComponent } from '../../infrastructure/shell';
import { RouterLoadingService } from '../../infrastructure/loading';
import { OnlineStatusMonitorService } from '../../infrastructure/network';
import { EnterpriseConfirmationDialogComponent, EnterpriseGlobalToastComponent } from '../../shared/ui';
import { ThemeService } from '../../theme';
import { LayoutHostComponent } from '../components/layout-host/layout-host.component';
import { LayoutService } from '../services/layout.service';

@Component({
  selector: 'app-root-layout',
  imports: [
    LayoutHostComponent,
    NavigationOverlayComponent,
    NavigationDrawerComponent,
    PlatformChromeComponent,
    EnterpriseGlobalToastComponent,
    EnterpriseConfirmationDialogComponent,
  ],
  templateUrl: './root-layout.component.html',
  styleUrl: './root-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'root-layout',
    '[attr.data-theme-mode]': 'modePreference()',
    '[attr.data-theme-resolved]': 'resolvedMode()',
    '[class.root-layout--sidebar-collapsed]': 'sidebarCollapsed()',
    '[class.mpa-theme-dark]': "resolvedMode() === 'dark'",
    '[class.mpa-theme-light]': "resolvedMode() === 'light'",
  },
})
export class RootLayoutComponent {
  private readonly layoutService = inject(LayoutService);
  private readonly themeService = inject(ThemeService);

  // Bootstrap platform infrastructure monitors
  private readonly _routerLoading = inject(RouterLoadingService);
  private readonly _onlineStatus = inject(OnlineStatusMonitorService);

  readonly modePreference = this.themeService.modePreference;
  readonly resolvedMode = this.themeService.resolvedMode;
  readonly sidebarCollapsed = this.layoutService.sidebarCollapsed;
}
