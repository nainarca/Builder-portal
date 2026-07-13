import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { ButtonComponent } from '@shared/ui';

import { BrandStudioStateService } from '../../services/brand-studio-state.service';

@Component({
  selector: 'app-wl-brand-quick-actions',
  imports: [ButtonComponent],
  template: `
    <section class="wl-quick-actions" aria-label="Quick actions">
      <app-button
        label="Open Studio"
        icon="pi pi-palette"
        (clicked)="openStudio()"
      />
      <app-button
        label="Preview Platform Brand"
        icon="pi pi-eye"
        severity="secondary"
        [outlined]="true"
        (clicked)="previewPlatformBrand()"
      />
    </section>
  `,
  styles: `
    .wl-quick-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WlBrandQuickActionsComponent {
  private readonly router = inject(Router);
  private readonly studio = inject(BrandStudioStateService);

  openStudio(): void {
    void this.router.navigate(['/super-admin/branding/studio']);
  }

  previewPlatformBrand(): void {
    this.studio.selectBrand('brand-platform');
    void this.router.navigate(['/super-admin/branding/studio']);
  }
}
