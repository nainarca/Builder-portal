import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { NavigationService } from '../../services';
import { NavListComponent } from '../nav-list/nav-list.component';

/** Recent pages placeholder — empty until recent tracking ships (DS-02). */
@Component({
  selector: 'app-recent-items-navigation',
  imports: [NavListComponent],
  templateUrl: './recent-items-navigation.component.html',
  styleUrl: './recent-items-navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentItemsNavigationComponent {
  private readonly navigationService = inject(NavigationService);

  readonly section = this.navigationService.recentItems;
  readonly isEmpty = computed(
    () => !(this.section()?.groups ?? []).some((group) => group.items.length > 0),
  );
}
