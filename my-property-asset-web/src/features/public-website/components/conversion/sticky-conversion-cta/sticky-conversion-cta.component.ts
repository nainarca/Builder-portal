import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { AuthEntryIntent } from '../../../models/conversion.model';
import { ConversionCtaLinkComponent } from '../conversion-cta-link/conversion-cta-link.component';

@Component({
  selector: 'app-sticky-conversion-cta',
  imports: [ConversionCtaLinkComponent],
  templateUrl: './sticky-conversion-cta.component.html',
  styleUrl: './sticky-conversion-cta.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StickyConversionCtaComponent {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly ctaLabel = input.required<string>();
  readonly ctaRoute = input('/auth/login');
  readonly ctaIntent = input<AuthEntryIntent>('signin');
  readonly analyticsName = input<string | undefined>(undefined);
}
