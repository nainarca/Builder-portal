import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ContactChannel } from '../../../models/company.model';

@Component({
  selector: 'app-contact-channel-card',
  templateUrl: './contact-channel-card.component.html',
  styleUrl: './contact-channel-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactChannelCardComponent {
  readonly channel = input.required<ContactChannel>();
}
