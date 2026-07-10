import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { NavigationService } from '../../services';
import { NavListComponent } from '../nav-list/nav-list.component';

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
}
