import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { NavigationSection } from '../../models';
import { NavigationService } from '../../services';
import { NavListComponent } from '../nav-list/nav-list.component';

@Component({
  selector: 'app-top-navigation',
  imports: [NavListComponent],
  templateUrl: './top-navigation.component.html',
  styleUrl: './top-navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopNavigationComponent {
  private readonly navigationService = inject(NavigationService);

  readonly section = input<NavigationSection | undefined>(undefined);

  readonly resolvedSection = computed(() => this.section() ?? this.navigationService.topNav());
}
