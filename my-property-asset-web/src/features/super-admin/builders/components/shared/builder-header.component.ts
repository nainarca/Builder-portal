import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';

import { PermissionService } from '@core/rbac';
import { ButtonComponent } from '@shared/ui';

import { BuilderAdminRecord } from '../../models/builder-admin.model';
import { BuilderAvatarComponent } from './builder-avatar.component';
import { BuilderStatusBadgeComponent } from './builder-status-badge.component';

@Component({
  selector: 'app-bldr-header',
  imports: [ButtonComponent, BuilderAvatarComponent, BuilderStatusBadgeComponent],
  template: `
    <header class="bldr-header">
      <div class="bldr-header__main">
        <app-bldr-avatar [name]="builder().companyName" [logoUrl]="builder().logoUrl"
          [primaryColor]="builder().primaryColor ?? '#1B4D89'" size="lg" />
        <div>
          <span class="mpa-eyebrow">Builder organization</span>
          <h1 class="ui-page-title">{{ builder().companyName }}</h1>
          @if (builder().tradingName) {
            <p class="ui-page-subtitle">{{ builder().tradingName }} · {{ builder().registrationNumber }}</p>
          }
          <div class="bldr-header__badges"><app-bldr-status-badge [status]="builder().status" /></div>
        </div>
      </div>
      <div class="bldr-header__actions">
        <app-button label="Back to list" icon="pi pi-arrow-left" [outlined]="true" (clicked)="goToList()" />
        @if (builder().status !== 'archived' && canEdit()) {
          <app-button label="Edit" icon="pi pi-pencil" (clicked)="goToEdit()" />
        }
        <ng-content />
      </div>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderHeaderComponent {
  private readonly router = inject(Router);
  private readonly permissions = inject(PermissionService);
  readonly builder = input.required<BuilderAdminRecord>();

  canEdit(): boolean { return this.permissions.hasPermission('id-02-builder-onboarding:operate'); }
  goToList(): void { void this.router.navigate(['/super-admin/builders']); }
  goToEdit(): void { void this.router.navigate(['/super-admin/builders', this.builder().id, 'edit']); }
}
