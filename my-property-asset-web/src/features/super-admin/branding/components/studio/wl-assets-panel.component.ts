import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { BrandStudioStateService } from '../../services/brand-studio-state.service';

@Component({
  selector: 'app-wl-assets-panel',
  template: `
    @if (brand(); as record) {
      <section class="wl-assets-panel" aria-label="Brand asset mockups">
        <article class="wl-assets-panel__card">
          <header class="wl-assets-panel__title">Email header &amp; footer</header>
          <div class="wl-assets-panel__mock">
            <div class="wl-assets-panel__email-header" [style.background]="record.colors.primary">
              {{ record.identity.applicationName }}
            </div>
            <div class="wl-assets-panel__email-body" [style.background]="record.colors.surface">
              <span class="wl-assets-panel__bar" [style.background]="record.colors.border"></span>
              <span class="wl-assets-panel__bar wl-assets-panel__bar--short" [style.background]="record.colors.border"></span>
            </div>
            <div class="wl-assets-panel__email-footer" [style.color]="record.colors.textMuted">
              © {{ record.identity.companyName }}
            </div>
          </div>
        </article>

        <article class="wl-assets-panel__card">
          <header class="wl-assets-panel__title">Loading screen</header>
          <div class="wl-assets-panel__mock wl-assets-panel__mock--center" [style.background]="record.colors.background">
            <span class="wl-assets-panel__logo" [style.background]="record.colors.primary">{{ record.identity.shortName }}</span>
            <span class="wl-assets-panel__dot-row">
              <span class="wl-assets-panel__dot" [style.background]="record.colors.primary"></span>
              <span class="wl-assets-panel__dot" [style.background]="record.colors.accent"></span>
              <span class="wl-assets-panel__dot" [style.background]="record.colors.secondary"></span>
            </span>
          </div>
        </article>

        <article class="wl-assets-panel__card">
          <header class="wl-assets-panel__title">Login</header>
          <div class="wl-assets-panel__mock wl-assets-panel__mock--center" [style.background]="record.colors.background">
            <span class="wl-assets-panel__logo" [style.background]="record.colors.primary">{{ record.identity.shortName }}</span>
            <span class="wl-assets-panel__input" [style.background]="record.colors.surface" [style.border-color]="record.colors.border"></span>
            <span class="wl-assets-panel__input" [style.background]="record.colors.surface" [style.border-color]="record.colors.border"></span>
            <span class="wl-assets-panel__btn" [style.background]="record.colors.primary">Sign in</span>
          </div>
        </article>

        <article class="wl-assets-panel__card">
          <header class="wl-assets-panel__title">Public website</header>
          <div class="wl-assets-panel__mock">
            <div class="wl-assets-panel__topbar" [style.background]="record.colors.primary">
              <span class="wl-assets-panel__brand">{{ record.identity.applicationName }}</span>
            </div>
            <div class="wl-assets-panel__hero" [style.background]="record.colors.surface">
              <span class="wl-assets-panel__bar" [style.background]="record.colors.border"></span>
              <span class="wl-assets-panel__btn" [style.background]="record.colors.accent">Learn more</span>
            </div>
          </div>
        </article>

        <article class="wl-assets-panel__card">
          <header class="wl-assets-panel__title">Dashboard</header>
          <div class="wl-assets-panel__mock" [style.background]="record.colors.background">
            <div class="wl-assets-panel__topbar" [style.background]="record.colors.primary">
              <span class="wl-assets-panel__brand">{{ record.identity.shortName }}</span>
            </div>
            <div class="wl-assets-panel__stats">
              <span class="wl-assets-panel__stat" [style.background]="record.colors.surface" [style.border-top-color]="record.colors.accent"></span>
              <span class="wl-assets-panel__stat" [style.background]="record.colors.surface" [style.border-top-color]="record.colors.success"></span>
              <span class="wl-assets-panel__stat" [style.background]="record.colors.surface" [style.border-top-color]="record.colors.info"></span>
            </div>
          </div>
        </article>

        <article class="wl-assets-panel__card">
          <header class="wl-assets-panel__title">Builder portal</header>
          <div class="wl-assets-panel__mock" [style.background]="record.colors.background">
            <div class="wl-assets-panel__topbar" [style.background]="record.colors.secondary">
              <span class="wl-assets-panel__brand">{{ record.identity.shortName }} Portal</span>
            </div>
            <div class="wl-assets-panel__portal">
              <span class="wl-assets-panel__side" [style.background]="record.colors.surface" [style.border-color]="record.colors.border"></span>
              <span class="wl-assets-panel__panel" [style.background]="record.colors.surface" [style.border-color]="record.colors.border"></span>
            </div>
          </div>
        </article>
      </section>
    }
  `,
  styles: `
    .wl-assets-panel {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 1rem;
    }
    .wl-assets-panel__card {
      display: flex;
      flex-direction: column;
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-md, 0.5rem);
      overflow: hidden;
      background: var(--mpa-color-surface);
    }
    .wl-assets-panel__title {
      padding: 0.6rem 0.85rem;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      font-weight: 600;
      color: var(--mpa-color-text);
      border-bottom: 1px solid var(--mpa-color-border);
    }
    .wl-assets-panel__mock { display: flex; flex-direction: column; min-height: 160px; }
    .wl-assets-panel__mock--center { align-items: center; justify-content: center; gap: 0.6rem; padding: 1.25rem; }
    .wl-assets-panel__email-header,
    .wl-assets-panel__topbar {
      display: flex;
      align-items: center;
      padding: 0.75rem 1rem;
      color: #fff;
      font-weight: 700;
    }
    .wl-assets-panel__brand { color: #fff; font-weight: 700; }
    .wl-assets-panel__email-body { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; padding: 1rem; }
    .wl-assets-panel__email-footer { padding: 0.65rem 1rem; font-size: var(--mpa-font-size-xs, 0.75rem); }
    .wl-assets-panel__bar { height: 0.6rem; border-radius: 999px; }
    .wl-assets-panel__bar--short { width: 55%; }
    .wl-assets-panel__logo {
      width: 2.75rem;
      height: 2.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--mpa-radius-sm, 0.375rem);
      color: #fff;
      font-weight: 700;
    }
    .wl-assets-panel__dot-row { display: flex; gap: 0.4rem; }
    .wl-assets-panel__dot { width: 0.6rem; height: 0.6rem; border-radius: 50%; }
    .wl-assets-panel__input {
      width: 80%;
      height: 1.75rem;
      border-radius: var(--mpa-radius-sm, 0.375rem);
      border: 1px solid transparent;
    }
    .wl-assets-panel__btn {
      padding: 0.4rem 1rem;
      border-radius: var(--mpa-radius-sm, 0.375rem);
      color: #fff;
      font-size: var(--mpa-font-size-xs, 0.75rem);
      font-weight: 600;
    }
    .wl-assets-panel__hero { flex: 1; display: flex; flex-direction: column; align-items: flex-start; gap: 0.65rem; padding: 1rem; }
    .wl-assets-panel__stats { flex: 1; display: flex; gap: 0.5rem; padding: 0.85rem; }
    .wl-assets-panel__stat {
      flex: 1;
      border-radius: var(--mpa-radius-sm, 0.375rem);
      border: 1px solid var(--mpa-color-border);
      border-top: 3px solid transparent;
    }
    .wl-assets-panel__portal { flex: 1; display: flex; gap: 0.5rem; padding: 0.85rem; }
    .wl-assets-panel__side { width: 30%; border-radius: var(--mpa-radius-sm, 0.375rem); border: 1px solid transparent; }
    .wl-assets-panel__panel { flex: 1; border-radius: var(--mpa-radius-sm, 0.375rem); border: 1px solid transparent; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WlAssetsPanelComponent {
  private readonly studio = inject(BrandStudioStateService);
  readonly brand = computed(() => this.studio.previewBrand());
}
