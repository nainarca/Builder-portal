import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BreadcrumbService } from '../../services';

@Component({
  selector: 'app-breadcrumb-navigation',
  imports: [RouterLink],
  templateUrl: './breadcrumb-navigation.component.html',
  styleUrl: './breadcrumb-navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbNavigationComponent {
  private readonly breadcrumbService = inject(BreadcrumbService);

  readonly items = this.breadcrumbService.items;
}
