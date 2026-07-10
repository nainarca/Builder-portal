import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ButtonComponent } from '@shared/ui';
import { CookieConsentService } from '../../services/cookie-consent.service';

@Component({
  selector: 'app-cookie-consent-banner',
  imports: [ButtonComponent],
  templateUrl: './cookie-consent-banner.component.html',
  styleUrl: './cookie-consent-banner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CookieConsentBannerComponent {
  private readonly consent = inject(CookieConsentService);

  readonly visible = this.consent.visible;

  accept(): void {
    this.consent.accept();
  }

  decline(): void {
    this.consent.decline();
  }
}
