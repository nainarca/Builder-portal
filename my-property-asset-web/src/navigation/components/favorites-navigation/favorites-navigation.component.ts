import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { NavigationService } from '../../services';
import { NavListComponent } from '../nav-list/nav-list.component';

/** Favorites placeholder — empty until a favorites store ships (DS-02). */
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
  readonly isEmpty = computed(
    () => !(this.section()?.groups ?? []).some((group) => group.items.length > 0),
  );
}
