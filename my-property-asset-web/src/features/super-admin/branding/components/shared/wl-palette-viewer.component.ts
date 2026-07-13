import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-wl-palette-viewer',
  template: `
    <div class="wl-palette-viewer">
      @if (label()) {
        <span class="wl-palette-viewer__label">{{ label() }}</span>
      }
      <div class="wl-palette-viewer__row">
        @for (color of palette(); track $index) {
          <span class="wl-palette-viewer__swatch" [style.background]="color" [attr.title]="color" [attr.aria-label]="color"></span>
        } @empty {
          <span class="wl-palette-viewer__empty">No palette generated</span>
        }
      </div>
    </div>
  `,
  styles: `
    .wl-palette-viewer {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    .wl-palette-viewer__label {
      font-size: var(--mpa-font-size-xs, 0.75rem);
      color: var(--mpa-color-text-muted);
    }
    .wl-palette-viewer__row {
      display: flex;
      gap: 0.4rem;
      flex-wrap: wrap;
    }
    .wl-palette-viewer__swatch {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: var(--mpa-radius-sm, 0.375rem);
      border: 1px solid var(--mpa-color-border);
    }
    .wl-palette-viewer__empty {
      font-size: var(--mpa-font-size-xs, 0.75rem);
      color: var(--mpa-color-text-muted);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WlPaletteViewerComponent {
  readonly palette = input.required<readonly string[]>();
  readonly label = input<string | undefined>(undefined);
}
