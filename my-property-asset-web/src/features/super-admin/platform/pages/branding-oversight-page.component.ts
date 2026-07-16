import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { BasePageComponent, ButtonComponent, PageHeaderComponent, UiToastService } from '@shared/ui';
import { PLATFORM_BRANDING_OVERSIGHT_HEADER } from '../config/platform.config';
import { BrandingOversightService } from '../services/branding-oversight.service';

@Component({
  selector: 'app-branding-oversight-page',
  imports: [DatePipe, BasePageComponent, PageHeaderComponent, ButtonComponent],
  template: `
    <app-base-page>
      <div class="brand-ops">
        <app-page-header
          [eyebrow]="header.eyebrow"
          [title]="header.title"
          [description]="header.description"
        />

        <table>
          <thead>
            <tr>
              <th>Builder</th>
              <th>Status</th>
              <th>Completion</th>
              <th>Enabled</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (item of items(); track item.organizationId) {
              <tr>
                <td>{{ item.builderName }}</td>
                <td>{{ item.statusLabel }}</td>
                <td>{{ item.completionPercent }}%</td>
                <td>{{ item.enabled ? 'Yes' : 'No' }}</td>
                <td>{{ item.lastUpdatedAt | date: 'medium' }}</td>
                <td class="brand-ops__actions">
                  <app-button label="Reset" size="small" [outlined]="true" (clicked)="reset(item.organizationId)" />
                  <app-button label="Disable" size="small" severity="warn" [outlined]="true" (clicked)="disable(item.organizationId)" />
                  <app-button label="Restore default" size="small" severity="success" [outlined]="true" (clicked)="restore(item.organizationId)" />
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </app-base-page>
  `,
  styles: `
    .brand-ops { display: grid; gap: 1rem; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 0.75rem; border-bottom: 1px solid var(--mpa-color-border); text-align: left; }
    .brand-ops__actions { display: flex; flex-wrap: wrap; gap: 0.35rem; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandingOversightPageComponent {
  private readonly oversight = inject(BrandingOversightService);
  private readonly toast = inject(UiToastService);

  readonly header = PLATFORM_BRANDING_OVERSIGHT_HEADER;
  readonly items = this.oversight.items;

  reset(organizationId: string): void {
    this.oversight.reset(organizationId);
    this.toast.success('Branding reset');
  }

  disable(organizationId: string): void {
    this.oversight.disable(organizationId);
    this.toast.warn('Branding disabled');
  }

  restore(organizationId: string): void {
    this.oversight.restoreDefault(organizationId);
    this.toast.success('Default branding restored');
  }
}
