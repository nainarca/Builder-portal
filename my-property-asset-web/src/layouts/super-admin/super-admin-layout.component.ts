import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ApplicationLayoutComponent } from '../enterprise-shell';
import { LayoutService } from '../services/layout.service';

@Component({
  selector: 'app-super-admin-layout',
  imports: [RouterOutlet, ApplicationLayoutComponent],
  templateUrl: './super-admin-layout.component.html',
  styleUrl: './super-admin-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuperAdminLayoutComponent implements OnInit {
  private readonly layoutService = inject(LayoutService);

  readonly sidebarCollapsed = this.layoutService.sidebarCollapsed;

  ngOnInit(): void {
    this.layoutService.setLayout('super-admin');
  }
}
