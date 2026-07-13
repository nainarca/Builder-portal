import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { PreviewSurface } from '../../models/brand-admin.model';

interface SurfaceOption {
  readonly id: PreviewSurface;
  readonly label: string;
}

@Component({
  selector: 'app-wl-theme-preview-panel',
  template: `
    <div class="wl-theme-preview">
      <div class="wl-theme-preview__group" role="group" aria-label="Theme mode">
        <button
          type="button"
          class="wl-theme-preview__toggle"
          [class.wl-theme-preview__toggle--active]="mode() === 'light'"
          [attr.aria-pressed]="mode() === 'light'"
          (click)="modeChange.emit('light')"
        >
          <i class="pi pi-sun" aria-hidden="true"></i> Light
        </button>
        <button
          type="button"
          class="wl-theme-preview__toggle"
          [class.wl-theme-preview__toggle--active]="mode() === 'dark'"
          [attr.aria-pressed]="mode() === 'dark'"
          (click)="modeChange.emit('dark')"
        >
          <i class="pi pi-moon" aria-hidden="true"></i> Dark
        </button>
      </div>

      <label class="wl-theme-preview__field">
        <span class="wl-theme-preview__label">Surface</span>
        <select
          class="wl-theme-preview__select"
          [value]="surface()"
          (change)="onSurfaceChange($event)"
        >
          @for (option of surfaces; track option.id) {
            <option [value]="option.id">{{ option.label }}</option>
          }
        </select>
      </label>
    </div>
  `,
  styles: `
    .wl-theme-preview {
      display: flex;
      align-items: flex-end;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .wl-theme-preview__group {
      display: inline-flex;
      gap: 0.25rem;
      padding: 0.25rem;
      background: var(--mpa-color-surface);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-md, 0.5rem);
    }
    .wl-theme-preview__toggle {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.4rem 0.75rem;
      border: none;
      background: transparent;
      color: var(--mpa-color-text-muted);
      border-radius: var(--mpa-radius-sm, 0.375rem);
      cursor: pointer;
      font-size: var(--mpa-font-size-sm, 0.875rem);
    }
    .wl-theme-preview__toggle--active {
      background: var(--mpa-color-primary);
      color: #fff;
    }
    .wl-theme-preview__field {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }
    .wl-theme-preview__label {
      font-size: var(--mpa-font-size-xs, 0.75rem);
      color: var(--mpa-color-text-muted);
    }
    .wl-theme-preview__select {
      padding: 0.45rem 0.6rem;
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-sm, 0.375rem);
      background: var(--mpa-color-surface);
      color: var(--mpa-color-text);
      font-size: var(--mpa-font-size-sm, 0.875rem);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WlThemePreviewPanelComponent {
  readonly mode = input<'light' | 'dark'>('light');
  readonly surface = input<PreviewSurface>('dashboard');

  readonly modeChange = output<'light' | 'dark'>();
  readonly surfaceChange = output<PreviewSurface>();

  readonly surfaces: readonly SurfaceOption[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'login', label: 'Login' },
    { id: 'public', label: 'Public Website' },
    { id: 'email', label: 'Email' },
    { id: 'loading', label: 'Loading' },
    { id: 'builder-portal', label: 'Builder Portal' },
  ];

  onSurfaceChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as PreviewSurface;
    this.surfaceChange.emit(value);
  }
}
