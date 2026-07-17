import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { PLATFORM_BRAND } from '@theme/config';
import { ThemeService } from '@theme/services/theme.service';

@Component({
  selector: 'app-auth-brand-mark',
  template: `
    <div class="auth-brand-mark" [class.auth-brand-mark--compact]="compact()">
      <img
        class="auth-brand-mark__logo"
        [src]="logoSrc()"
        [alt]="logoAlt"
        [width]="logoWidth"
        [height]="logoHeight"
      />
    </div>
  `,
  styles: `
    .auth-brand-mark {
      display: flex;
      justify-content: center;
    }

    .auth-brand-mark--compact .auth-brand-mark__logo {
      height: 2rem;
    }

    .auth-brand-mark__logo {
      width: auto;
      height: 2.25rem;
      object-fit: contain;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthBrandMarkComponent {
  private readonly theme = inject(ThemeService);

  readonly compact = input(false);

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
}
