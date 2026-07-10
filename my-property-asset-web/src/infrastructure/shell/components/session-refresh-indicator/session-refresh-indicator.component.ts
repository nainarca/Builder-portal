import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { SessionStateService } from '@core/auth/session';
import { IconComponent } from '@shared/ui';

@Component({
  selector: 'app-session-refresh-indicator',
  imports: [IconComponent],
  templateUrl: './session-refresh-indicator.component.html',
  styleUrl: './session-refresh-indicator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionRefreshIndicatorComponent {
  private readonly sessionState = inject(SessionStateService);

  readonly visible = this.sessionState.showRefreshIndicator;
  readonly message = computed(() => this.sessionState.lifecycleState().message);
  readonly label = computed(() => {
    const state = this.sessionState.lifecycleState();
    return state.isRecovering ? 'Reconnecting' : 'Refreshing session';
  });
}
