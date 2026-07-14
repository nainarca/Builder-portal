import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { ButtonComponent } from '@shared/ui';

@Component({
  selector: 'app-bill-quick-actions',
  imports: [ButtonComponent],
  template: `
    <section class="bill-quick-actions" aria-label="Billing quick actions">
      <header class="bill-quick-actions__header">
        <h2 class="bill-quick-actions__title">Quick actions</h2>
        <p class="bill-quick-actions__subtitle">Jump to commercial workflows.</p>
      </header>
      <div class="bill-quick-actions__row">
        <app-button label="Plans" icon="pi pi-box" (clicked)="go('/super-admin/billing/plans')" />
        <app-button
          label="Invoices"
          icon="pi pi-file"
          severity="secondary"
          [outlined]="true"
          (clicked)="go('/super-admin/billing/invoices')"
        />
        <app-button
          label="Licenses"
          icon="pi pi-key"
          severity="secondary"
          [outlined]="true"
          (clicked)="go('/super-admin/billing/licenses')"
        />
        <app-button
          label="Usage"
          icon="pi pi-chart-bar"
          severity="secondary"
          [outlined]="true"
          (clicked)="go('/super-admin/billing/usage')"
        />
        <app-button
          label="Alerts"
          icon="pi pi-bell"
          severity="secondary"
          [outlined]="true"
          (clicked)="go('/super-admin/billing/notifications')"
        />
      </div>
    </section>
  `,
  styles: `
    .bill-quick-actions {
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-sm, 0.75rem);
      padding: var(--mpa-spacing-md, 1.25rem);
      background: var(--mpa-color-surface);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-lg, 0.75rem);
    }

    .bill-quick-actions__header {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }

    .bill-quick-actions__title {
      margin: 0;
      font-size: var(--mpa-font-size-md, 1rem);
      font-weight: 700;
      color: var(--mpa-color-text);
    }

    .bill-quick-actions__subtitle {
      margin: 0;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text-muted);
    }

    .bill-quick-actions__row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillQuickActionsComponent {
  private readonly router = inject(Router);

  go(path: string): void {
    void this.router.navigateByUrl(path);
  }
}
