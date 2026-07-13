import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ConversionTrustBadge } from '../../../models/conversion.model';

@Component({
  selector: 'app-conversion-trust-badge',
  templateUrl: './conversion-trust-badge.component.html',
  styleUrl: './conversion-trust-badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversionTrustBadgeComponent {
  readonly badge = input.required<ConversionTrustBadge>();
}
