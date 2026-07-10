import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Message } from 'primeng/message';

@Component({
  selector: 'app-message',
  imports: [Message],
  template: `<p-message [severity]="severity()" [text]="text()" [icon]="icon()" [closable]="closable()" />`,
  styleUrl: './message.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageComponent {
  readonly severity = input<'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast'>('info');
  readonly text = input<string | undefined>(undefined);
  readonly icon = input<string | undefined>(undefined);
  readonly closable = input(false);
}
