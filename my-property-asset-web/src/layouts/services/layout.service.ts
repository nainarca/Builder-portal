import { Injectable, inject, signal } from '@angular/core';

import { ThemeModePreference, ThemeService } from '../../theme';
import { LayoutType, ThemeMode } from '../models/layout.types';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  private readonly themeService = inject(ThemeService);

  private readonly layoutSignal = signal<LayoutType>('public');
  private readonly sidebarCollapsedSignal = signal(false);

  readonly layout = this.layoutSignal.asReadonly();
  readonly themeMode = this.themeService.modePreference;
  readonly resolvedThemeMode = this.themeService.resolvedMode;
  readonly sidebarCollapsed = this.sidebarCollapsedSignal.asReadonly();

  setLayout(layout: LayoutType): void {
    this.layoutSignal.set(layout);
  }

  setThemeMode(mode: ThemeMode): void {
    this.themeService.setMode(mode as ThemeModePreference);
  }

  setSidebarCollapsed(collapsed: boolean): void {
    this.sidebarCollapsedSignal.set(collapsed);
  }
}
