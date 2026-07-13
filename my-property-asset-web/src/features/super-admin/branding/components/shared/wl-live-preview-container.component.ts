import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  viewChild,
} from '@angular/core';

import { BrandPreviewService } from '../../services/brand-preview.service';
import { BrandStudioStateService } from '../../services/brand-studio-state.service';

@Component({
  selector: 'app-wl-live-preview-container',
  template: `
    <div class="wl-live-preview wl-live-preview--{{ studio.previewDevice() }}">
      <div class="wl-live-preview__frame">
        <div #surface class="wl-live-preview__surface">
          @if (brand(); as record) {
            @switch (studio.previewSurface()) {
              @case ('login') {
                <div class="wl-surface wl-surface--centered">
                  <div class="wl-surface__logo">{{ record.identity.shortName }}</div>
                  <h2 class="wl-surface__title">Sign in to {{ record.identity.applicationName }}</h2>
                  <div class="wl-surface__input"></div>
                  <div class="wl-surface__input"></div>
                  <div class="wl-surface__button">Continue</div>
                </div>
              }
              @case ('public') {
                <div class="wl-surface">
                  <div class="wl-surface__topbar">
                    <span class="wl-surface__brand">{{ record.identity.applicationName }}</span>
                    <span class="wl-surface__nav"></span>
                  </div>
                  <div class="wl-surface__hero">
                    <h1 class="wl-surface__title">{{ record.identity.tagline }}</h1>
                    <div class="wl-surface__button">Get started</div>
                  </div>
                </div>
              }
              @case ('email') {
                <div class="wl-surface wl-surface--email">
                  <div class="wl-surface__email-header">{{ record.identity.applicationName }}</div>
                  <div class="wl-surface__email-body">
                    <div class="wl-surface__line"></div>
                    <div class="wl-surface__line wl-surface__line--short"></div>
                    <div class="wl-surface__button">View details</div>
                  </div>
                  <div class="wl-surface__email-footer">{{ record.identity.companyName }}</div>
                </div>
              }
              @case ('loading') {
                <div class="wl-surface wl-surface--centered">
                  <div class="wl-surface__logo">{{ record.identity.shortName }}</div>
                  <div class="wl-surface__spinner" aria-hidden="true"></div>
                  <span class="wl-surface__muted">Loading {{ record.identity.applicationName }}…</span>
                </div>
              }
              @case ('builder-portal') {
                <div class="wl-surface">
                  <div class="wl-surface__topbar">
                    <span class="wl-surface__brand">{{ record.identity.shortName }} Portal</span>
                  </div>
                  <div class="wl-surface__split">
                    <div class="wl-surface__sidebar"></div>
                    <div class="wl-surface__content">
                      <div class="wl-surface__card"></div>
                      <div class="wl-surface__card"></div>
                    </div>
                  </div>
                </div>
              }
              @default {
                <div class="wl-surface">
                  <div class="wl-surface__topbar">
                    <span class="wl-surface__brand">{{ record.identity.applicationName }}</span>
                    <span class="wl-surface__nav"></span>
                  </div>
                  <div class="wl-surface__split">
                    <div class="wl-surface__sidebar"></div>
                    <div class="wl-surface__content">
                      <div class="wl-surface__stats">
                        <div class="wl-surface__stat"></div>
                        <div class="wl-surface__stat"></div>
                        <div class="wl-surface__stat"></div>
                      </div>
                      <div class="wl-surface__card"></div>
                    </div>
                  </div>
                </div>
              }
            }
          }
        </div>
      </div>
    </div>
  `,
  styles: `
    .wl-live-preview {
      display: flex;
      justify-content: center;
      padding: 1rem;
      background: var(--mpa-color-background, #f4f6f9);
      border-radius: var(--mpa-radius-lg, 0.75rem);
    }
    .wl-live-preview__frame {
      width: 100%;
      transition: max-width 0.2s ease;
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-md, 0.5rem);
      overflow: hidden;
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12);
    }
    .wl-live-preview--desktop .wl-live-preview__frame { max-width: 100%; }
    .wl-live-preview--tablet .wl-live-preview__frame { max-width: 768px; }
    .wl-live-preview--mobile .wl-live-preview__frame { max-width: 375px; }
    .wl-live-preview__surface {
      min-height: 360px;
      background: var(--mpa-color-background);
      color: var(--mpa-color-text);
      font-family: var(--mpa-font-family, system-ui, sans-serif);
    }
    .wl-surface {
      display: flex;
      flex-direction: column;
      min-height: 360px;
    }
    .wl-surface--centered {
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      padding: 2rem;
    }
    .wl-surface--email {
      background: var(--mpa-color-surface);
    }
    .wl-surface__topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.85rem 1.25rem;
      background: var(--mpa-color-primary);
      color: #fff;
    }
    .wl-surface__brand { font-weight: 700; }
    .wl-surface__nav {
      width: 40%;
      height: 0.6rem;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.35);
    }
    .wl-surface__hero {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      padding: 2rem;
      background: var(--mpa-color-surface);
    }
    .wl-surface__title { margin: 0; color: var(--mpa-color-text); font-size: 1.35rem; }
    .wl-surface__split { flex: 1; display: flex; }
    .wl-surface__sidebar {
      width: 4.5rem;
      background: var(--mpa-color-surface-elevated, var(--mpa-color-surface));
      border-right: 1px solid var(--mpa-color-border);
    }
    .wl-surface__content { flex: 1; padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem; }
    .wl-surface__stats { display: flex; gap: 0.75rem; }
    .wl-surface__stat {
      flex: 1;
      height: 3.25rem;
      border-radius: var(--mpa-radius-md, 0.5rem);
      background: var(--mpa-color-surface);
      border: 1px solid var(--mpa-color-border);
      border-top: 3px solid var(--mpa-color-accent);
    }
    .wl-surface__card {
      height: 5rem;
      border-radius: var(--mpa-radius-md, 0.5rem);
      background: var(--mpa-color-surface);
      border: 1px solid var(--mpa-color-border);
    }
    .wl-surface__logo {
      width: 3rem;
      height: 3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--mpa-radius-md, 0.5rem);
      background: var(--mpa-color-primary);
      color: #fff;
      font-weight: 700;
    }
    .wl-surface__input {
      width: min(280px, 80%);
      height: 2.4rem;
      border-radius: var(--mpa-radius-sm, 0.375rem);
      background: var(--mpa-color-surface);
      border: 1px solid var(--mpa-color-border);
    }
    .wl-surface__button {
      padding: 0.55rem 1.25rem;
      border-radius: var(--mpa-radius-sm, 0.375rem);
      background: var(--mpa-color-primary);
      color: #fff;
      font-weight: 600;
      font-size: var(--mpa-font-size-sm, 0.875rem);
    }
    .wl-surface__email-header {
      padding: 1.1rem 1.5rem;
      background: var(--mpa-color-primary);
      color: #fff;
      font-weight: 700;
    }
    .wl-surface__email-body { flex: 1; padding: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem; }
    .wl-surface__email-footer {
      padding: 1rem 1.5rem;
      color: var(--mpa-color-text-muted);
      font-size: var(--mpa-font-size-xs, 0.75rem);
      border-top: 1px solid var(--mpa-color-border);
    }
    .wl-surface__line { height: 0.75rem; border-radius: 999px; background: var(--mpa-color-border); }
    .wl-surface__line--short { width: 60%; }
    .wl-surface__muted { color: var(--mpa-color-text-muted); font-size: var(--mpa-font-size-sm, 0.875rem); }
    .wl-surface__spinner {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      border: 3px solid var(--mpa-color-border);
      border-top-color: var(--mpa-color-primary);
      animation: wl-spin 0.9s linear infinite;
    }
    @keyframes wl-spin { to { transform: rotate(360deg); } }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WlLivePreviewContainerComponent {
  readonly studio = inject(BrandStudioStateService);
  private readonly preview = inject(BrandPreviewService);

  private readonly surfaceRef = viewChild<ElementRef<HTMLElement>>('surface');
  readonly brand = computed(() => this.studio.previewBrand());

  constructor() {
    effect(() => {
      const host = this.surfaceRef()?.nativeElement;
      if (!host) return;
      this.preview.applyToElement(host, this.studio.previewBrand(), this.studio.previewMode());
    });
  }
}
