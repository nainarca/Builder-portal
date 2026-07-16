import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  effect,
  inject,
  input,
  viewChild,
} from '@angular/core';

import { BrandPreviewService } from '@features/super-admin/branding/services/brand-preview.service';
import { PreviewSurface } from '@features/super-admin/branding/models/brand-admin.model';
import { BuilderBrandingProfile } from '../models/builder-branding.model';

@Component({
  selector: 'app-builder-brand-live-preview',
  template: `
    <div class="wl-live-preview wl-live-preview--{{ device() }}">
      <div class="wl-live-preview__frame">
        <div #surfaceEl class="wl-live-preview__surface">
          @switch (surface()) {
            @case ('login') {
              <div class="b-brand-preview b-brand-preview--centered">
                <div class="b-brand-preview__brand">{{ branding().shortName }}</div>
                <h2 class="b-brand-preview__title">{{ branding().applicationName }}</h2>
                <p class="b-brand-preview__subtitle">{{ branding().tagline }}</p>
                <div class="b-brand-preview__button">Sign in</div>
              </div>
            }
            @case ('builder-portal') {
              <div class="b-brand-preview">
                <div class="b-brand-preview__topbar">{{ branding().displayName }}</div>
                <div class="b-brand-preview__split">
                  <div class="b-brand-preview__nav"></div>
                  <div class="b-brand-preview__content">
                    <div class="b-brand-preview__banner"></div>
                    <div class="b-brand-preview__cards">
                      <div class="b-brand-preview__card"></div>
                      <div class="b-brand-preview__card"></div>
                    </div>
                  </div>
                </div>
              </div>
            }
            @default {
              <div class="b-brand-preview">
                <div class="b-brand-preview__topbar">{{ branding().applicationName }}</div>
                <div class="b-brand-preview__hero">
                  <div class="b-brand-preview__brand">{{ branding().shortName }}</div>
                  <h3 class="b-brand-preview__title">{{ branding().tagline }}</h3>
                  <p class="b-brand-preview__subtitle">{{ branding().supportEmail }}</p>
                </div>
              </div>
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
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-md, 0.5rem);
      overflow: hidden;
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12);
    }
    .wl-live-preview--desktop .wl-live-preview__frame { max-width: 100%; }
    .wl-live-preview--tablet .wl-live-preview__frame { max-width: 768px; }
    .wl-live-preview--mobile .wl-live-preview__frame { max-width: 375px; }
    .wl-live-preview__surface {
      min-height: 320px;
      background: var(--mpa-color-background);
      color: var(--mpa-color-text);
      font-family: var(--mpa-font-family, system-ui, sans-serif);
    }
    .b-brand-preview { min-height: 320px; display: flex; flex-direction: column; }
    .b-brand-preview--centered { align-items: center; justify-content: center; gap: 0.85rem; padding: 2rem; }
    .b-brand-preview__topbar {
      padding: 0.9rem 1.25rem;
      background: var(--mpa-color-primary);
      color: #fff;
      font-weight: 700;
    }
    .b-brand-preview__split { display: flex; flex: 1; min-height: 0; }
    .b-brand-preview__nav {
      width: 4.5rem;
      background: color-mix(in srgb, var(--mpa-color-primary) 10%, var(--mpa-color-surface));
      border-right: 1px solid var(--mpa-color-border);
    }
    .b-brand-preview__content { flex: 1; padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem; }
    .b-brand-preview__banner {
      height: 5rem;
      border-radius: var(--mpa-radius-md, 0.5rem);
      background: color-mix(in srgb, var(--mpa-color-accent) 20%, var(--mpa-color-surface));
      border: 1px solid var(--mpa-color-border);
    }
    .b-brand-preview__cards { display: flex; gap: 1rem; }
    .b-brand-preview__card {
      flex: 1;
      height: 5.5rem;
      border-radius: var(--mpa-radius-md, 0.5rem);
      background: var(--mpa-color-surface);
      border: 1px solid var(--mpa-color-border);
      box-shadow: var(--mpa-shadow-sm);
    }
    .b-brand-preview__hero {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      padding: 2rem;
      background: var(--mpa-color-surface);
    }
    .b-brand-preview__brand {
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
    .b-brand-preview__title { margin: 0; }
    .b-brand-preview__subtitle { margin: 0; color: var(--mpa-color-text-muted); }
    .b-brand-preview__button {
      padding: 0.6rem 1.2rem;
      border-radius: var(--mpa-radius-sm, 0.375rem);
      background: var(--mpa-color-primary);
      color: #fff;
      font-weight: 600;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderBrandLivePreviewComponent {
  private readonly surfaceElement = viewChild<ElementRef<HTMLElement>>('surfaceEl');
  private readonly preview = inject(BrandPreviewService);

  readonly branding = input.required<BuilderBrandingProfile>();
  readonly mode = input<'light' | 'dark'>('light');
  readonly device = input<'desktop' | 'tablet' | 'mobile'>('desktop');
  readonly surface = input<PreviewSurface>('builder-portal');

  constructor() {
    effect(() => {
      const surface = this.surfaceElement()?.nativeElement;
      if (!surface) {
        return;
      }
      const profile = this.branding();
      const record = {
        id: profile.organizationId,
        type: 'builder' as const,
        status: profile.enabled ? ('active' as const) : ('draft' as const),
        healthScore: 100,
        identity: {
          applicationName: profile.applicationName,
          shortName: profile.shortName,
          companyName: profile.companyName,
          tagline: profile.tagline,
          description: profile.displayName,
        },
        logos: [
          { key: 'primary', label: 'Primary logo', src: profile.media.logo, alt: profile.displayName },
          { key: 'dark', label: 'Dark logo', src: profile.media.darkLogo, alt: `${profile.displayName} dark` },
          { key: 'favicon', label: 'Favicon', src: profile.media.favicon, alt: 'Favicon' },
        ],
        colors: {
          primary: profile.primaryColor,
          secondary: profile.secondaryColor,
          accent: profile.accentColor,
          success: '#16A34A',
          warning: '#D97706',
          danger: '#DC2626',
          info: '#2563EB',
          surface: '#FFFFFF',
          surfaceElevated: '#FFFFFF',
          background: '#F4F6F9',
          text: '#0F172A',
          textMuted: '#64748B',
          border: '#E8EDF3',
        },
        typography: {
          fontFamily:
            profile.theme.typography === 'dm-sans'
              ? 'DM Sans, system-ui, sans-serif'
              : profile.theme.typography === 'plus-jakarta'
                ? 'Plus Jakarta Sans, system-ui, sans-serif'
                : 'Inter, system-ui, sans-serif',
          headingWeight: '600',
          bodyWeight: '400',
        },
        theme: { mode: 'light' as const, themePackage: 'builder', inheritFrom: 'platform-default' },
        preferences: { defaultLanguage: 'en', defaultTimezone: 'UTC', defaultCurrency: 'USD' },
        createdAt: '',
        updatedAt: '',
      };
      this.preview.applyToElement(surface, record, this.mode());
    });
  }
}
