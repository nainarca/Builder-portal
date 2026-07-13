import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { BrandStudioStateService } from '../../services/brand-studio-state.service';
import { WlTypographyViewerComponent } from '../shared/wl-typography-viewer.component';

@Component({
  selector: 'app-wl-typography-panel',
  imports: [WlTypographyViewerComponent],
  template: `
    @if (studio.draftModel(); as model) {
      <section class="wl-typography-panel" aria-label="Typography">
        <div class="wl-typography-panel__controls">
          <label class="wl-typography-panel__field">
            <span class="wl-typography-panel__label">Font family</span>
            <select
              class="wl-typography-panel__select"
              [value]="model.typography.fontFamily"
              (change)="onFontFamily($event)"
            >
              @for (font of fontFamilies; track font) {
                <option [value]="font">{{ font }}</option>
              }
            </select>
          </label>

          <label class="wl-typography-panel__field">
            <span class="wl-typography-panel__label">Heading weight</span>
            <select
              class="wl-typography-panel__select"
              [value]="model.typography.headingWeight"
              (change)="onHeadingWeight($event)"
            >
              @for (weight of weights; track weight) {
                <option [value]="weight">{{ weight }}</option>
              }
            </select>
          </label>

          <label class="wl-typography-panel__field">
            <span class="wl-typography-panel__label">Body weight</span>
            <select
              class="wl-typography-panel__select"
              [value]="model.typography.bodyWeight"
              (change)="onBodyWeight($event)"
            >
              @for (weight of weights; track weight) {
                <option [value]="weight">{{ weight }}</option>
              }
            </select>
          </label>
        </div>

        <app-wl-typography-viewer
          [fontFamily]="model.typography.fontFamily"
          [headingWeight]="model.typography.headingWeight"
          [bodyWeight]="model.typography.bodyWeight"
        />
      </section>
    }
  `,
  styles: `
    .wl-typography-panel { display: flex; flex-direction: column; gap: 1.25rem; }
    .wl-typography-panel__controls {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
    }
    .wl-typography-panel__field { display: flex; flex-direction: column; gap: 0.35rem; }
    .wl-typography-panel__label {
      font-size: var(--mpa-font-size-sm, 0.875rem);
      font-weight: 500;
      color: var(--mpa-color-text);
    }
    .wl-typography-panel__select {
      padding: 0.5rem 0.65rem;
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-sm, 0.375rem);
      background: var(--mpa-color-surface);
      color: var(--mpa-color-text);
      font-size: var(--mpa-font-size-sm, 0.875rem);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WlTypographyPanelComponent {
  readonly studio = inject(BrandStudioStateService);

  readonly fontFamilies: readonly string[] = [
    'Inter, system-ui, sans-serif',
    'DM Sans, system-ui, sans-serif',
    'Plus Jakarta Sans, system-ui, sans-serif',
    'Roboto, system-ui, sans-serif',
    'Poppins, system-ui, sans-serif',
    'Georgia, serif',
  ];

  readonly weights: readonly string[] = ['300', '400', '500', '600', '700', '800'];

  onFontFamily(event: Event): void {
    this.patchTypography({ fontFamily: this.readValue(event) });
  }

  onHeadingWeight(event: Event): void {
    this.patchTypography({ headingWeight: this.readValue(event) });
  }

  onBodyWeight(event: Event): void {
    this.patchTypography({ bodyWeight: this.readValue(event) });
  }

  private patchTypography(partial: Partial<{ fontFamily: string; headingWeight: string; bodyWeight: string }>): void {
    const model = this.studio.draftModel();
    if (!model) return;
    this.studio.patchDraft({ typography: { ...model.typography, ...partial } });
  }

  private readValue(event: Event): string {
    return (event.target as HTMLSelectElement).value;
  }
}
