import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { MessageComponent } from '../../primitives/message/message.component';

@Component({
  selector: 'app-inline-message',
  imports: [MessageComponent],
  template: `<app-message [severity]="severity()" [text]="text()" [icon]="icon()" [closable]="closable()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InlineMessageComponent {
  readonly severity = input<'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast'>('info');
  readonly text = input.required<string>();
  readonly icon = input<string | undefined>(undefined);
  readonly closable = input(false);
}
