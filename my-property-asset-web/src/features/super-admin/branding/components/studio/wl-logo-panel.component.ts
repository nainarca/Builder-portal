import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { BrandStudioStateService } from '../../services/brand-studio-state.service';

@Component({
  selector: 'app-wl-logo-panel',
  template: `
    <section class="wl-logo-panel" aria-label="Brand logos">
      <p class="wl-logo-panel__hint">
        <i class="pi pi-info-circle" aria-hidden="true"></i>
        SVG recommended · transparent background · max 1&nbsp;MB. Uploading is disabled in this preview build.
      </p>

      <div class="wl-logo-panel__grid">
        @for (slot of logos(); track slot.key) {
          <article class="wl-logo-panel__slot">
            <header class="wl-logo-panel__slot-header">
              <span class="wl-logo-panel__slot-label">{{ slot.label }}</span>
              @if (slot.required) {
                <span class="wl-logo-panel__required">Required</span>
              }
            </header>

            <div class="wl-logo-panel__preview">
              @if (slot.src) {
                <img class="wl-logo-panel__img" [src]="slot.src" [alt]="slot.alt" />
              } @else {
                <span class="wl-logo-panel__placeholder">
                  <i class="pi pi-image" aria-hidden="true"></i>
                  No logo set
                </span>
              }
            </div>

            <div class="wl-logo-panel__actions">
              <button type="button" class="wl-logo-panel__btn" disabled>
                <i class="pi pi-upload" aria-hidden="true"></i> Upload
              </button>
              <button type="button" class="wl-logo-panel__btn" disabled>
                <i class="pi pi-crop" aria-hidden="true"></i> Crop
              </button>
            </div>
          </article>
        }
      </div>
    </section>
  `,
  styles: `
    .wl-logo-panel { display: flex; flex-direction: column; gap: 1rem; }
    .wl-logo-panel__hint {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0;
      padding: 0.65rem 0.85rem;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text-muted);
      background: var(--mpa-color-surface);
      border: 1px dashed var(--mpa-color-border);
      border-radius: var(--mpa-radius-md, 0.5rem);
    }
    .wl-logo-panel__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
    }
    .wl-logo-panel__slot {
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
      padding: 1rem;
      background: var(--mpa-color-surface);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-md, 0.5rem);
    }
    .wl-logo-panel__slot-header { display: flex; align-items: center; justify-content: space-between; }
    .wl-logo-panel__slot-label { font-weight: 600; color: var(--mpa-color-text); }
    .wl-logo-panel__required {
      font-size: var(--mpa-font-size-xs, 0.75rem);
      color: var(--mpa-color-warning);
    }
    .wl-logo-panel__preview {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 6rem;
      background: var(--mpa-color-background, #f4f6f9);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-sm, 0.375rem);
    }
    .wl-logo-panel__img { max-width: 80%; max-height: 80%; object-fit: contain; }
    .wl-logo-panel__placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.35rem;
      color: var(--mpa-color-text-muted);
      font-size: var(--mpa-font-size-xs, 0.75rem);
    }
    .wl-logo-panel__placeholder i { font-size: 1.5rem; }
    .wl-logo-panel__actions { display: flex; gap: 0.5rem; }
    .wl-logo-panel__btn {
      flex: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      padding: 0.45rem;
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-sm, 0.375rem);
      background: var(--mpa-color-surface);
      color: var(--mpa-color-text-muted);
      font-size: var(--mpa-font-size-xs, 0.75rem);
      cursor: not-allowed;
      opacity: 0.7;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WlLogoPanelComponent {
  private readonly studio = inject(BrandStudioStateService);
  readonly logos = computed(() => this.studio.previewBrand().logos);
}
