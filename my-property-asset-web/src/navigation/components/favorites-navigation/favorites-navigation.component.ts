import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { NavigationService } from '../../services';
import { NavListComponent } from '../nav-list/nav-list.component';

@Component({
  selector: 'app-favorites-navigation',
  imports: [NavListComponent],
  templateUrl: './favorites-navigation.component.html',
  styleUrl: './favorites-navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoritesNavigationComponent {
  private readonly navigationService = inject(NavigationService);

  readonly section = this.navigationService.favorites;
}
