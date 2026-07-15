import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { CompletionStatus } from '../../models/completion.model';

@Component({
  selector: 'app-completion-status-badge',
  template: `<span class="completion-status-badge" [class]="'completion-status-badge--' + status()"><i [class]="icon()" aria-hidden="true"></i> {{ label() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompletionStatusBadgeComponent {
  readonly status = input.required<CompletionStatus>();

  readonly label = computed(() => {
    const map: Record<CompletionStatus, string> = {
      'not-ready': 'Not ready',
      ready: 'Ready to finalize',
      completed: 'Completed',
    };
    return map[this.status()];
  });

  readonly icon = computed(() => {
    const map: Record<CompletionStatus, string> = {
      'not-ready': 'pi pi-hourglass',
      ready: 'pi pi-flag',
      completed: 'pi pi-check-circle',
    };
    return map[this.status()];
  });
}
