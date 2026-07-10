import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { NavigationSection } from '../../models';
import { NavigationService } from '../../services';
import { NavListComponent } from '../nav-list/nav-list.component';

@Component({
  selector: 'app-footer-navigation',
  imports: [NavListComponent],
  templateUrl: './footer-navigation.component.html',
  styleUrl: './footer-navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterNavigationComponent {
  private readonly navigationService = inject(NavigationService);

  readonly section = input<NavigationSection | undefined>(undefined);

  readonly resolvedSection = computed(() => this.section() ?? this.navigationService.footerNav());
}
