import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { NavigationSection } from '../../models';
import { NavigationService } from '../../services';
import { NavListComponent } from '../nav-list/nav-list.component';

@Component({
  selector: 'app-context-navigation',
  imports: [NavListComponent],
  templateUrl: './context-navigation.component.html',
  styleUrl: './context-navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContextNavigationComponent {
  private readonly navigationService = inject(NavigationService);

  readonly section = input<NavigationSection | undefined>(undefined);

  readonly resolvedSection = computed(() => this.section() ?? this.navigationService.contextNav());

  readonly hasItems = computed(() =>
    (this.resolvedSection()?.groups ?? []).some((group) => group.items.length > 0),
  );
}
