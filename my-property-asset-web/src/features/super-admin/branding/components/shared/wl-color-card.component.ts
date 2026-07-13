import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-wl-color-card',
  template: `
    <div class="wl-color-card">
      <span class="wl-color-card__swatch" [style.background]="hex()" aria-hidden="true"></span>
      <span class="wl-color-card__text">
        <span class="wl-color-card__label">{{ label() }}</span>
        <span class="wl-color-card__hex">{{ hex() }}</span>
      </span>
    </div>
  `,
  styles: `
    .wl-color-card {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.5rem;
      background: var(--mpa-color-surface);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-md, 0.5rem);
    }
    .wl-color-card__swatch {
      width: 2rem;
      height: 2rem;
      border-radius: var(--mpa-radius-sm, 0.375rem);
      border: 1px solid var(--mpa-color-border);
      flex: none;
    }
    .wl-color-card__text {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .wl-color-card__label {
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text);
      text-transform: capitalize;
    }
    .wl-color-card__hex {
      font-size: var(--mpa-font-size-xs, 0.75rem);
      color: var(--mpa-color-text-muted);
      text-transform: uppercase;
      font-variant-numeric: tabular-nums;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WlColorCardComponent {
  readonly label = input.required<string>();
  readonly hex = input.required<string>();
}
