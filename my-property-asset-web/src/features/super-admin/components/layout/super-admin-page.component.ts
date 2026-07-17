import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Super Admin page frame — consistent spacing inside DS-01 application layout.
 * Feature-local chrome; composes enterprise design tokens only.
 */
@Component({
  selector: 'app-sa-page',
  template: `<div class="sa-page"><ng-content /></div>`,
  styles: `
    .sa-page {
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
export class SuperAdminPageComponent {}
