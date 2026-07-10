import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { MessageComponent } from '../../primitives/message/message.component';
import { CardComponent } from './card.component';

@Component({
  selector: 'app-info-card',
  imports: [CardComponent, MessageComponent],
  template: `
    <app-card variant="outlined">
      <app-message [severity]="severity()" [text]="message()" [icon]="icon()" />
      <ng-content />
    </app-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoCardComponent {
  readonly message = input.required<string>();
  readonly severity = input<'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast'>('info');
  readonly icon = input<string | undefined>(undefined);
}
