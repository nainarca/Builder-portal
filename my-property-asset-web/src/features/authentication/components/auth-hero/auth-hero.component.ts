import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { PLATFORM_BRAND } from '@theme/config';
import { ThemeService } from '@theme/services/theme.service';

@Component({
  selector: 'app-auth-hero',
  templateUrl: './auth-hero.component.html',
  styleUrl: './auth-hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthHeroComponent {
  private readonly theme = inject(ThemeService);

  readonly brand = PLATFORM_BRAND;

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

  readonly highlights = [
  'Unified property asset visibility',
  'Enterprise-grade security and compliance',
  'Built for builders, investors, and operators',
  ];
}
