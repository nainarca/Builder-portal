import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { AuthEntryIntent } from '../../../models/conversion.model';
import { ConversionCtaLinkComponent } from '../conversion-cta-link/conversion-cta-link.component';

@Component({
  selector: 'app-floating-conversion-cta',
  imports: [ConversionCtaLinkComponent],
  templateUrl: './floating-conversion-cta.component.html',
  styleUrl: './floating-conversion-cta.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FloatingConversionCtaComponent {
  readonly label = input.required<string>();
  readonly route = input('/auth/login');
  readonly intent = input<AuthEntryIntent>('signin');
  readonly analyticsName = input<string | undefined>(undefined);
}
