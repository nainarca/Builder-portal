import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { PublicSocialLink } from '../../../models/public-section.model';

@Component({
  selector: 'app-social-links-row',
  templateUrl: './social-links-row.component.html',
  styleUrl: './social-links-row.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialLinksRowComponent {
  readonly links = input.required<readonly PublicSocialLink[]>();
  readonly label = input<string>('Follow us');
}
