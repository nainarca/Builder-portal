import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';

import { ContentWrapperComponent, PageContainerComponent, ResponsiveContainerComponent } from '../components';
import { LayoutService } from '../services/layout.service';
import { CookieConsentBannerComponent } from '../../features/public-website/components/cookie-consent-banner/cookie-consent-banner.component';
import { PublicFooterComponent } from '../../features/public-website/components/public-footer/public-footer.component';
import { PublicHeaderComponent } from '../../features/public-website/components/public-header/public-header.component';
import { FloatingConversionCtaComponent } from '../../features/public-website/components/conversion/floating-conversion-cta/floating-conversion-cta.component';
import { StickyConversionCtaComponent } from '../../features/public-website/components/conversion/sticky-conversion-cta/sticky-conversion-cta.component';
import { CONVERSION_FLOATING_CTA, CONVERSION_STICKY_CTA } from '../../features/public-website/config/conversion-entry.config';

@Component({
  selector: 'app-public-layout',
  imports: [
    RouterOutlet,
    ResponsiveContainerComponent,
    PublicHeaderComponent,
    ContentWrapperComponent,
    PageContainerComponent,
    PublicFooterComponent,
    CookieConsentBannerComponent,
    StickyConversionCtaComponent,
    FloatingConversionCtaComponent,
  ],
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicLayoutComponent implements OnInit {
  private readonly layoutService = inject(LayoutService);
  private readonly router = inject(Router);

  readonly stickyCta = CONVERSION_STICKY_CTA;
  readonly floatingCta = CONVERSION_FLOATING_CTA;

  private readonly currentPath = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      startWith(null),
      map(() => this.router.url.split('?')[0] ?? '/'),
    ),
    { initialValue: '/' },
  );

  readonly showConversionPrompts = computed(() => {
    const path = this.currentPath();
    return path !== '/get-started' && path !== '/contact' && !path.startsWith('/auth');
  });

  ngOnInit(): void {
    this.layoutService.setLayout('public');
  }
}
