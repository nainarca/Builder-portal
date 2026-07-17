import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { LayoutService } from '../../../layouts/services/layout.service';
import { AuthBrandMarkComponent } from '../components/auth-brand-mark/auth-brand-mark.component';
import { AuthHeroComponent } from '../components/auth-hero/auth-hero.component';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, AuthHeroComponent, AuthBrandMarkComponent],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLayoutComponent implements OnInit {
  private readonly layoutService = inject(LayoutService);

  ngOnInit(): void {
    this.layoutService.setLayout('public');
  }
}
