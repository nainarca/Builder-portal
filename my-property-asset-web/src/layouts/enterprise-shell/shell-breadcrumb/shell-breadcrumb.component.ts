import { ChangeDetectionStrategy, Component } from '@angular/core';

import { BreadcrumbPlaceholderComponent } from '../../components/breadcrumb-placeholder/breadcrumb-placeholder.component';

/**
 * P0.1 §1.4 Breadcrumb — ancestor path for nested records.
 * Wraps existing breadcrumb navigation; no visual redesign (DS-01).
 */
@Component({
  selector: 'app-shell-breadcrumb',
  imports: [BreadcrumbPlaceholderComponent],
  templateUrl: './shell-breadcrumb.component.html',
  styleUrl: './shell-breadcrumb.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'shell-breadcrumb',
  },
})
export class ShellBreadcrumbComponent {}
