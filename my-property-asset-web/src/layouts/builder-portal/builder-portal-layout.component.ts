import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ApplicationLayoutComponent } from '../enterprise-shell';
import { LayoutService } from '../services/layout.service';

@Component({
  selector: 'app-builder-portal-layout',
  imports: [RouterOutlet, ApplicationLayoutComponent],
  templateUrl: './builder-portal-layout.component.html',
  styleUrl: './builder-portal-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderPortalLayoutComponent implements OnInit {
  private readonly layoutService = inject(LayoutService);

  readonly sidebarCollapsed = this.layoutService.sidebarCollapsed;

  ngOnInit(): void {
    this.layoutService.setLayout('builder-portal');
  }
}
