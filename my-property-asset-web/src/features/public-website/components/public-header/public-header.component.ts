import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonComponent } from '@shared/ui';
import { PLATFORM_BRAND } from '@theme/config';
import { ThemeService } from '@theme/services/theme.service';
import { ThemeModePreference } from '@theme/models';
import {
  QuickActionsComponent,
  TopNavigationComponent,
} from '@navigation/components';
import { NavigationStateService } from '@navigation/services';

@Component({
  selector: 'app-public-header',
  imports: [RouterLink, ButtonComponent, TopNavigationComponent, QuickActionsComponent],
  templateUrl: './public-header.component.html',
  styleUrl: './public-header.component.scss',
  host: {
    class: 'public-header-host layout-sticky-header',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicHeaderComponent {
  private readonly theme = inject(ThemeService);
  private readonly navigationState = inject(NavigationStateService);

  readonly brand = PLATFORM_BRAND;
  readonly mobileMenuOpen = this.navigationState.mobileMenuOpen;
  readonly scrolled = signal(false);

  readonly logoSrc = computed(() => {
    const mode = this.theme.resolvedMode();
    const fallback = this.brand.logo?.src ?? 'assets/branding/platform/logo.svg';
    return mode === 'dark'
      ? (this.brand.logoVariants?.dark?.src ?? fallback)
      : (this.brand.logoVariants?.light?.src ?? fallback);
  });

  readonly themeModeLabel = computed(() => {
    const mode = this.theme.modePreference();
    return mode === 'dark' ? 'Dark' : mode === 'light' ? 'Light' : 'System';
  });

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        this.scrolled.set(window.scrollY > 12);
      }, { passive: true });
    }
  }

  toggleMobileNavigation(): void {
    this.navigationState.toggleMobileNavigation();
  }

  cycleThemeMode(): void {
    const modes: ThemeModePreference[] = ['light', 'dark', 'system'];
    const current = this.theme.modePreference();
    const next = modes[(modes.indexOf(current) + 1) % modes.length];
    this.theme.setMode(next);
  }
}
