import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';

import { ButtonComponent } from '@shared/ui';

import { SettingsAdminStoreService } from '../../services/settings-admin-store.service';
import { SettingsNavigationStateService } from '../../services/settings-navigation-state.service';

@Component({
  selector: 'app-cfg-quick-actions',
  imports: [ButtonComponent],
  template: `
    <section class="cfg-quick-actions" aria-label="Quick actions">
      <app-button
        label="Open General"
        icon="pi pi-sliders-h"
        (clicked)="openGeneral()"
      />
      <app-button
        label="Security audit"
        icon="pi pi-shield"
        severity="secondary"
        [outlined]="true"
        (clicked)="openSecurity()"
      />
      <app-button
        label="Feature flags"
        icon="pi pi-flag"
        severity="secondary"
        [outlined]="true"
        (clicked)="openFeatureFlags()"
      />
      <app-button
        [label]="maintenanceLabel()"
        icon="pi pi-power-off"
        [severity]="maintenanceActive() ? 'warn' : 'secondary'"
        [outlined]="true"
        (clicked)="openMaintenance()"
      />
    </section>
  `,
  styles: `
    .cfg-quick-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CfgQuickActionsComponent {
  private readonly router = inject(Router);
  private readonly navState = inject(SettingsNavigationStateService);
  private readonly store = inject(SettingsAdminStoreService);

  readonly maintenanceActive = computed(() => this.store.record().platform.maintenanceMode);

  readonly maintenanceLabel = computed(() =>
    this.maintenanceActive() ? 'Maintenance: On' : 'Maintenance toggle',
  );

  openGeneral(): void {
    this.navState.setActiveCategory('general');
    void this.router.navigateByUrl('/super-admin/settings/general');
  }

  openSecurity(): void {
    this.navState.setActiveCategory('security');
    void this.router.navigateByUrl('/super-admin/settings/security');
  }

  openFeatureFlags(): void {
    this.navState.setActiveCategory('platform');
    void this.router.navigateByUrl('/super-admin/settings/platform');
  }

  openMaintenance(): void {
    this.navState.setActiveCategory('platform');
    void this.router.navigate(['/super-admin/settings/platform'], {
      fragment: 'maintenance',
    });
  }
}
