import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonComponent } from '@shared/ui';
import { PageHeroContent } from '../../../models/company.model';
import { PublicAnalyticsService } from '../../../services/public-analytics.service';

@Component({
  selector: 'app-page-hero-banner',
  imports: [RouterLink, ButtonComponent],
  templateUrl: './page-hero-banner.component.html',
  styleUrl: './page-hero-banner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeroBannerComponent {
  private readonly analytics = inject(PublicAnalyticsService);

  readonly content = input.required<PageHeroContent>();
  readonly compact = input(false);

  trackCta(name?: string): void {
    if (name) {
      this.analytics.trackCta(name);
    }
  }
}
