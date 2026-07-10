import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { NavigationSection } from '../../models';
import { NavigationService } from '../../services';
import { NavListComponent } from '../nav-list/nav-list.component';

@Component({
  selector: 'app-user-navigation',
  imports: [NavListComponent],
  templateUrl: './user-navigation.component.html',
  styleUrl: './user-navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserNavigationComponent {
  private readonly navigationService = inject(NavigationService);

  readonly section = input<NavigationSection | undefined>(undefined);

  readonly resolvedSection = computed(() => this.section() ?? this.navigationService.userNav());
}
