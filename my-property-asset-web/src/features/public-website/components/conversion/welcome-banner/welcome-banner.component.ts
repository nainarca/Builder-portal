import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { AuthEntryIntent } from '../../../models/conversion.model';

@Component({
  selector: 'app-welcome-banner',
  templateUrl: './welcome-banner.component.html',
  styleUrl: './welcome-banner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeBannerComponent {
  readonly activeIntent = input<AuthEntryIntent>('get-started');
  readonly intentSelected = output<AuthEntryIntent>();

  selectIntent(intent: AuthEntryIntent): void {
    this.intentSelected.emit(intent);
  }
}
