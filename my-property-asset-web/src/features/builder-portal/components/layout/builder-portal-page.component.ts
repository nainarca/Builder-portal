import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Builder Portal page frame — consistent spacing inside DS-01 application layout.
 * Mirrors Super Admin `app-sa-page`; feature-local chrome only.
 */
@Component({
  selector: 'app-bp-page',
  template: `<div class="bp-page"><ng-content /></div>`,
  styles: `
    .bp-page {
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-xl);
      width: 100%;
      max-width: 100%;
      animation: ui-fade-in var(--mpa-transition-normal) ease;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderPortalPageComponent {}
