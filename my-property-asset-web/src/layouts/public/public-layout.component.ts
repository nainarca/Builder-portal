import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ContentWrapperComponent, PageContainerComponent, ResponsiveContainerComponent } from '../components';
import { LayoutService } from '../services/layout.service';
import { CookieConsentBannerComponent } from '../../features/public-website/components/cookie-consent-banner/cookie-consent-banner.component';
import { PublicFooterComponent } from '../../features/public-website/components/public-footer/public-footer.component';
import { PublicHeaderComponent } from '../../features/public-website/components/public-header/public-header.component';

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
  ],
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicLayoutComponent implements OnInit {
  private readonly layoutService = inject(LayoutService);

  ngOnInit(): void {
    this.layoutService.setLayout('public');
  }
}
