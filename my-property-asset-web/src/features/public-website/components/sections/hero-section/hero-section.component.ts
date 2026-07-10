import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonComponent } from '@shared/ui';
import { PublicCtaAction } from '../../../models/public-section.model';
import { PublicAnalyticsService } from '../../../services/public-analytics.service';

@Component({
  selector: 'app-public-hero-section',
  imports: [RouterLink, ButtonComponent],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicHeroSectionComponent {
  private readonly analytics = inject(PublicAnalyticsService);

  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();
  readonly subtitle = input.required<string>();
  readonly highlights = input<readonly string[]>([]);
  readonly primaryCta = input.required<PublicCtaAction>();
  readonly secondaryCta = input<PublicCtaAction | undefined>(undefined);
  readonly logoSrc = input<string | undefined>(undefined);
  readonly logoAlt = input('MyPropertyAsset');

  trackCta(action: PublicCtaAction): void {
    if (action.analyticsName) {
      this.analytics.trackCta(action.analyticsName);
    }
  }
}
