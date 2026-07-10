import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonComponent } from '@shared/ui';
import { PublicCtaAction } from '../../../models/public-section.model';
import { PublicAnalyticsService } from '../../../services/public-analytics.service';

@Component({
  selector: 'app-public-cta-section',
  imports: [RouterLink, ButtonComponent],
  templateUrl: './cta-section.component.html',
  styleUrl: './cta-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicCtaSectionComponent {
  private readonly analytics = inject(PublicAnalyticsService);

  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly primaryCta = input.required<PublicCtaAction>();
  readonly secondaryCta = input<PublicCtaAction | undefined>(undefined);

  trackCta(action: PublicCtaAction): void {
    if (action.analyticsName) {
      this.analytics.trackCta(action.analyticsName);
    }
  }
}
