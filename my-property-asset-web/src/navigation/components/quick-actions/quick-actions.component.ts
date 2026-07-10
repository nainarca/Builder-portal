import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { NavigationSection } from '../../models';
import { NavigationService } from '../../services';
import { NavListComponent } from '../nav-list/nav-list.component';

@Component({
  selector: 'app-quick-actions',
  imports: [NavListComponent],
  templateUrl: './quick-actions.component.html',
  styleUrl: './quick-actions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickActionsComponent {
  private readonly navigationService = inject(NavigationService);

  readonly section = input<NavigationSection | undefined>(undefined);

  readonly resolvedSection = computed(
    () => this.section() ?? this.navigationService.quickActions(),
  );
}
