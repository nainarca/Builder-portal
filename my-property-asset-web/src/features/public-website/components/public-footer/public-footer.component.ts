import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PLATFORM_BRAND } from '@theme/config';
import { ThemeService } from '@theme/services/theme.service';
import { PUBLIC_FOOTER_COLUMNS, PUBLIC_SOCIAL_LINKS } from '../../config/public-footer.config';
import { PUBLIC_WEBSITE_BRAND } from '../../config/public-website.config';
import { PublicNewsletterFormComponent } from '../newsletter-form/newsletter-form.component';

@Component({
  selector: 'app-public-footer',
  imports: [RouterLink, PublicNewsletterFormComponent],
  templateUrl: './public-footer.component.html',
  styleUrl: './public-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicFooterComponent {
  private readonly theme = inject(ThemeService);

  readonly brand = PLATFORM_BRAND;
  readonly tagline = PUBLIC_WEBSITE_BRAND.tagline;
  readonly columns = PUBLIC_FOOTER_COLUMNS;
  readonly socialLinks = PUBLIC_SOCIAL_LINKS;
  readonly year = new Date().getFullYear();

  readonly logoSrc = computed(() => {
    const mode = this.theme.resolvedMode();
    const fallback = this.brand.logo?.src ?? 'assets/branding/platform/logo.svg';
    return mode === 'dark'
      ? (this.brand.logoVariants?.dark?.src ?? fallback)
      : (this.brand.logoVariants?.light?.src ?? fallback);
  });
}
