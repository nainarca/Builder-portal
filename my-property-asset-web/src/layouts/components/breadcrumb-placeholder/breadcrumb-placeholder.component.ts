import { ChangeDetectionStrategy, Component } from '@angular/core';

import { BreadcrumbNavigationComponent } from '../../../navigation/components/breadcrumb-navigation/breadcrumb-navigation.component';

@Component({
  selector: 'app-breadcrumb-placeholder',
  imports: [BreadcrumbNavigationComponent],
  templateUrl: './breadcrumb-placeholder.component.html',
  styleUrl: './breadcrumb-placeholder.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbPlaceholderComponent {}
