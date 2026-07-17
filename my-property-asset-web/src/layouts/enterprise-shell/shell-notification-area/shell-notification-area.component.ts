import { ChangeDetectionStrategy, Component, HostListener, signal } from '@angular/core';

/**
 * Shell notification area — P0.1 §1.1 / UI-REBIRTH §9 foundation chrome.
 * Visual notification center affordance only; no backend wiring in this batch.
 */
@Component({
  selector: 'app-shell-notification-area',
  templateUrl: './shell-notification-area.component.html',
  styleUrl: './shell-notification-area.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'shell-notification-area',
  },
})
export class ShellNotificationAreaComponent {
  readonly open = signal(false);
  /** Reserved for live unread counts; foundation keeps chrome quiet. */
  readonly unreadCount = signal(0);

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open()) {
      this.open.set(false);
    }
  }

  toggle(): void {
    this.open.update((value) => !value);
  }

  close(): void {
    this.open.set(false);
  }
}
