import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonComponent } from '@shared/ui';
import { AuthEntryIntent } from '../../../models/conversion.model';
import { ConversionAttributionService } from '../../../services/conversion-attribution.service';
import { ConversionNavigationService } from '../../../services/conversion-navigation.service';

@Component({
  selector: 'app-conversion-cta-link',
  imports: [RouterLink, ButtonComponent],
  templateUrl: './conversion-cta-link.component.html',
  styleUrl: './conversion-cta-link.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversionCtaLinkComponent {
  private readonly conversionNav = inject(ConversionNavigationService);
  private readonly attribution = inject(ConversionAttributionService);

  readonly label = input.required<string>();
  readonly route = input.required<string>();
  readonly fragment = input<string | undefined>(undefined);
  readonly returnUrl = input<string | undefined>(undefined);
  readonly intent = input<AuthEntryIntent | undefined>(undefined);
  readonly analyticsName = input<string | undefined>(undefined);
  readonly outlined = input(false);
  readonly severity = input<'primary' | 'secondary' | 'contrast'>('primary');

  readonly link = computed(() =>
    this.conversionNav.resolveLink(this.route(), {
      returnUrl: this.returnUrl(),
      intent: this.intent(),
    }),
  );

  onClick(): void {
    const name = this.analyticsName();
    if (!name) {
      return;
    }

    this.conversionNav.trackConversionCta({
      name,
      surface: this.conversionNav.isAuthRoute(this.route()) ? 'authentication' : 'public-website',
      intent: this.intent(),
      returnUrl: this.returnUrl(),
      attribution: this.attribution.attribution(),
    });
  }
}
