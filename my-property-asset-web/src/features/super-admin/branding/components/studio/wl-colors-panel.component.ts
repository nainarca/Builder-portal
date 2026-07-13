import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { BrandColorSet } from '../../models/brand-admin.model';
import { BrandPreviewService } from '../../services/brand-preview.service';
import { BrandStudioStateService } from '../../services/brand-studio-state.service';
import { WlColorCardComponent } from '../shared/wl-color-card.component';
import { WlPaletteViewerComponent } from '../shared/wl-palette-viewer.component';

interface ColorField {
  readonly key: keyof BrandColorSet;
  readonly label: string;
}

interface ContrastPair {
  readonly label: string;
  readonly foreground: keyof BrandColorSet;
  readonly background: keyof BrandColorSet;
}

@Component({
  selector: 'app-wl-colors-panel',
  imports: [WlColorCardComponent, WlPaletteViewerComponent],
  template: `
    @if (studio.draftModel(); as model) {
      <section class="wl-colors-panel" aria-label="Brand colors">
        <div class="wl-colors-panel__grid">
          @for (field of fields; track field.key) {
            <label class="wl-colors-panel__field">
              <span class="wl-colors-panel__label">{{ field.label }}</span>
              <span class="wl-colors-panel__control">
                <input
                  type="color"
                  class="wl-colors-panel__picker"
                  [value]="model.colors[field.key]"
                  [attr.aria-label]="field.label"
                  (input)="onColor(field.key, $event)"
                />
                <span class="wl-colors-panel__hex">{{ model.colors[field.key] }}</span>
              </span>
            </label>
          }
        </div>

        <div class="wl-colors-panel__section">
          <h4 class="wl-colors-panel__heading">Contrast preview</h4>
          <div class="wl-colors-panel__contrast">
            @for (pair of contrastPairs(); track pair.label) {
              <div class="wl-colors-panel__contrast-item">
                <span
                  class="wl-colors-panel__contrast-sample"
                  [style.color]="pair.foreground"
                  [style.background]="pair.background"
                >Aa</span>
                <span class="wl-colors-panel__contrast-body">
                  <span class="wl-colors-panel__contrast-label">{{ pair.label }}</span>
                  <span class="wl-colors-panel__contrast-ratio" [class]="pair.rating">
                    {{ pair.ratio }}:1 · {{ pair.grade }}
                  </span>
                </span>
              </div>
            }
          </div>
        </div>

        <div class="wl-colors-panel__section">
          <div class="wl-colors-panel__section-head">
            <h4 class="wl-colors-panel__heading">Palette generator</h4>
            <button type="button" class="wl-colors-panel__generate" (click)="generatePalette()">
              <i class="pi pi-sparkles" aria-hidden="true"></i>
              Generate from primary
            </button>
          </div>
          <app-wl-palette-viewer [palette]="palette()" label="Generated shades" />
          <div class="wl-colors-panel__cards">
            <app-wl-color-card label="Primary" [hex]="model.colors.primary" />
            <app-wl-color-card label="Accent" [hex]="model.colors.accent" />
          </div>
        </div>
      </section>
    }
  `,
  styles: `
    .wl-colors-panel { display: flex; flex-direction: column; gap: 1.5rem; }
    .wl-colors-panel__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 0.75rem;
    }
    .wl-colors-panel__field { display: flex; flex-direction: column; gap: 0.35rem; }
    .wl-colors-panel__label {
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text);
      text-transform: capitalize;
    }
    .wl-colors-panel__control {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.35rem 0.5rem;
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-sm, 0.375rem);
      background: var(--mpa-color-surface);
    }
    .wl-colors-panel__picker {
      width: 2rem;
      height: 2rem;
      padding: 0;
      border: none;
      background: none;
      cursor: pointer;
    }
    .wl-colors-panel__hex {
      font-size: var(--mpa-font-size-xs, 0.75rem);
      color: var(--mpa-color-text-muted);
      text-transform: uppercase;
      font-variant-numeric: tabular-nums;
    }
    .wl-colors-panel__section { display: flex; flex-direction: column; gap: 0.75rem; }
    .wl-colors-panel__section-head { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; }
    .wl-colors-panel__heading { margin: 0; font-size: var(--mpa-font-size-md, 1rem); color: var(--mpa-color-text); }
    .wl-colors-panel__contrast {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 0.75rem;
    }
    .wl-colors-panel__contrast-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.65rem;
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-md, 0.5rem);
      background: var(--mpa-color-surface);
    }
    .wl-colors-panel__contrast-sample {
      width: 2.75rem;
      height: 2.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--mpa-radius-sm, 0.375rem);
      border: 1px solid var(--mpa-color-border);
      font-weight: 700;
    }
    .wl-colors-panel__contrast-body { display: flex; flex-direction: column; gap: 0.2rem; }
    .wl-colors-panel__contrast-label { font-size: var(--mpa-font-size-sm, 0.875rem); color: var(--mpa-color-text); }
    .wl-colors-panel__contrast-ratio { font-size: var(--mpa-font-size-xs, 0.75rem); font-weight: 600; }
    .wl-colors-panel__contrast-ratio.pass { color: var(--mpa-color-success); }
    .wl-colors-panel__contrast-ratio.warn { color: var(--mpa-color-warning); }
    .wl-colors-panel__contrast-ratio.fail { color: var(--mpa-color-danger); }
    .wl-colors-panel__generate {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.45rem 0.85rem;
      border: 1px solid var(--mpa-color-primary);
      border-radius: var(--mpa-radius-sm, 0.375rem);
      background: transparent;
      color: var(--mpa-color-primary);
      font-weight: 600;
      cursor: pointer;
    }
    .wl-colors-panel__cards { display: flex; gap: 0.75rem; flex-wrap: wrap; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WlColorsPanelComponent {
  readonly studio = inject(BrandStudioStateService);
  private readonly preview = inject(BrandPreviewService);

  private readonly generated = signal<readonly string[]>([]);

  readonly fields: readonly ColorField[] = [
    { key: 'primary', label: 'Primary' },
    { key: 'secondary', label: 'Secondary' },
    { key: 'accent', label: 'Accent' },
    { key: 'success', label: 'Success' },
    { key: 'warning', label: 'Warning' },
    { key: 'danger', label: 'Danger' },
    { key: 'info', label: 'Info' },
    { key: 'surface', label: 'Surface' },
    { key: 'surfaceElevated', label: 'Surface elevated' },
    { key: 'background', label: 'Background' },
    { key: 'text', label: 'Text' },
    { key: 'textMuted', label: 'Text muted' },
    { key: 'border', label: 'Border' },
  ];

  private readonly pairs: readonly ContrastPair[] = [
    { label: 'Text on background', foreground: 'text', background: 'background' },
    { label: 'Text on surface', foreground: 'text', background: 'surface' },
    { label: 'Primary on surface', foreground: 'primary', background: 'surface' },
  ];

  readonly palette = computed(() => {
    const generated = this.generated();
    if (generated.length > 0) return generated;
    const model = this.studio.draftModel();
    return model ? this.preview.generatePalette(model.colors.primary) : [];
  });

  readonly contrastPairs = computed(() => {
    const model = this.studio.draftModel();
    if (!model) return [];
    return this.pairs.map((pair) => {
      const foreground = model.colors[pair.foreground];
      const background = model.colors[pair.background];
      const ratio = this.preview.getContrastRatio(foreground, background);
      const rounded = Math.round(ratio * 100) / 100;
      const grade = ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : ratio >= 3 ? 'AA Large' : 'Fail';
      const rating = ratio >= 4.5 ? 'pass' : ratio >= 3 ? 'warn' : 'fail';
      return { label: pair.label, foreground, background, ratio: rounded, grade, rating };
    });
  });

  onColor(key: keyof BrandColorSet, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.studio.patchColors({ [key]: value } as Partial<BrandColorSet>);
  }

  generatePalette(): void {
    const model = this.studio.draftModel();
    if (!model) return;
    this.generated.set(this.preview.generatePalette(model.colors.primary));
  }
}
