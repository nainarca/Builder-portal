import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { DashboardQuickActionItem } from '../../models/dashboard.model';
import { QuickActionCardComponent } from './quick-action-card.component';

@Component({
  selector: 'app-sa-action-button-grid',
  imports: [QuickActionCardComponent],
  template: `
    <div class="sa-action-grid" role="list">
      @for (action of actions(); track action.id) {
        <app-sa-quick-action-card
          role="listitem"
          [action]="action"
          [pinned]="isPinned(action.id)"
          [favorite]="isFavorite(action.id)"
          (selected)="actionSelected.emit($event)"
        />
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionButtonGridComponent {
  readonly actions = input.required<readonly DashboardQuickActionItem[]>();
  readonly pinnedIds = input<readonly string[]>([]);
  readonly favoriteIds = input<readonly string[]>([]);

  readonly actionSelected = output<DashboardQuickActionItem>();

  isPinned(id: string): boolean {
    return this.pinnedIds().includes(id);
  }

  isFavorite(id: string): boolean {
    return this.favoriteIds().includes(id);
  }
}
