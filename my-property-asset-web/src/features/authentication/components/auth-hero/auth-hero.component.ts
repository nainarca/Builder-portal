import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs';

import { PLATFORM_BRAND } from '@theme/config';
import { ThemeService } from '@theme/services/theme.service';
import { AUTH_ENTRY_EXPERIENCES } from '../../../public-website/config/conversion-entry.config';
import { AuthEntryIntent } from '../../../public-website/models/conversion.model';

@Component({
  selector: 'app-auth-hero',
  templateUrl: './auth-hero.component.html',
  styleUrl: './auth-hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthHeroComponent {
  private readonly theme = inject(ThemeService);
  private readonly router = inject(Router);

  readonly brand = PLATFORM_BRAND;

  private readonly intent = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      startWith(null),
      map(() => this.readIntent()),
    ),
    { initialValue: 'signin' as AuthEntryIntent },
  );

  readonly experience = computed(() => AUTH_ENTRY_EXPERIENCES[this.intent()]);

  readonly logoSrc = computed(() => {
    const mode = this.theme.resolvedMode();
    const fallback = this.brand.logo?.src ?? 'assets/branding/platform/logo.svg';
    return mode === 'dark'
      ? (this.brand.logoVariants?.dark?.src ?? fallback)
      : (this.brand.logoVariants?.light?.src ?? fallback);
  });

  readonly logoAlt = this.brand.logo?.alt ?? this.brand.name;
  readonly logoWidth = this.brand.logo?.width ?? 160;
  readonly logoHeight = this.brand.logo?.height ?? 40;

  private readIntent(): AuthEntryIntent {
    const value = this.router.parseUrl(this.router.url).queryParams['intent'];
    return value === 'get-started' ? 'get-started' : 'signin';
  }
}
