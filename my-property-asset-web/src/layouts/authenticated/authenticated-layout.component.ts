import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import {
  ContentWrapperComponent,
  FooterPlaceholderComponent,
  HeaderPlaceholderComponent,
  PageContainerComponent,
  ResponsiveContainerComponent,
  SidebarPlaceholderComponent,
} from '../components';
import { LayoutService } from '../services/layout.service';

@Component({
  selector: 'app-authenticated-layout',
  imports: [
    RouterOutlet,
    ResponsiveContainerComponent,
    SidebarPlaceholderComponent,
    HeaderPlaceholderComponent,
    ContentWrapperComponent,
    PageContainerComponent,
    FooterPlaceholderComponent,
  ],
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
