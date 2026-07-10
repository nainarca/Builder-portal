import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { NavigationStateService } from '../../services';

@Component({
  selector: 'app-navigation-overlay',
  templateUrl: './navigation-overlay.component.html',
  styleUrl: './navigation-overlay.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.navigation-overlay--visible]': 'overlayOpen()',
  },
})
export class NavigationOverlayComponent {
  private readonly state = inject(NavigationStateService);

  readonly overlayOpen = this.state.overlayOpen;

  close(): void {
    this.state.closeOverlay();
    this.state.closeMobileNavigation();
    this.state.closeDrawer();
  }
}
