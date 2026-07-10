import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import {
  ContentWrapperComponent,
  PageContainerComponent,
  ResponsiveContainerComponent,
} from '../components';
import { LayoutService } from '../services/layout.service';

@Component({
  selector: 'app-blank-layout',
  imports: [
    RouterOutlet,
    ResponsiveContainerComponent,
    ContentWrapperComponent,
    PageContainerComponent,
  ],
  templateUrl: './blank-layout.component.html',
  styleUrl: './blank-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlankLayoutComponent implements OnInit {
  private readonly layoutService = inject(LayoutService);

  ngOnInit(): void {
    this.layoutService.setLayout('blank');
  }
}
