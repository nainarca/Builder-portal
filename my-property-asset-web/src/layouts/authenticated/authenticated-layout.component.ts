import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ApplicationLayoutComponent } from '../enterprise-shell';
import { LayoutService } from '../services/layout.service';

/**
 * Generic authenticated shell (future Support Console / Internal Operations).
 * Uses the same Application Layout as Super Admin / Builder Portal with workspace chrome off.
 */
@Component({
  selector: 'app-authenticated-layout',
  imports: [RouterOutlet, ApplicationLayoutComponent],
  templateUrl: './authenticated-layout.component.html',
  styleUrl: './authenticated-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthenticatedLayoutComponent implements OnInit {
  private readonly layoutService = inject(LayoutService);

  readonly sidebarCollapsed = this.layoutService.sidebarCollapsed;

  ngOnInit(): void {
    this.layoutService.setLayout('authenticated');
  }
}
