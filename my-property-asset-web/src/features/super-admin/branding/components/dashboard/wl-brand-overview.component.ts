import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { BrandAdminStoreService } from '../../services/brand-admin-store.service';

interface OverviewStat {
  readonly label: string;
  readonly value: string;
  readonly icon: string;
  readonly accent: string;
}

@Component({
  selector: 'app-wl-brand-overview',
  template: `
    <section class="wl-brand-overview" aria-label="Brand overview">
      @for (stat of stats(); track stat.label) {
        <article class="wl-brand-overview__card">
          <span class="wl-brand-overview__icon" [style.color]="stat.accent" aria-hidden="true">
            <i [class]="stat.icon"></i>
          </span>
          <span class="wl-brand-overview__value">{{ stat.value }}</span>
          <span class="wl-brand-overview__label">{{ stat.label }}</span>
        </article>
      }
    </section>
  `,
  styles: `
    .wl-brand-overview {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
    }
    .wl-brand-overview__card {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      padding: 1.25rem;
      background: var(--mpa-color-surface);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-md, 0.5rem);
    }
    .wl-brand-overview__icon { font-size: 1.35rem; }
    .wl-brand-overview__value {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--mpa-color-text);
    }
    .wl-brand-overview__label {
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text-muted);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WlBrandOverviewComponent {
  private readonly store = inject(BrandAdminStoreService);

  private readonly averageHealth = computed(() => {
    const brands = this.store.brands();
    if (brands.length === 0) return 0;
    const total = brands.reduce((sum, brand) => sum + brand.healthScore, 0);
    return Math.round(total / brands.length);
  });

  readonly stats = computed<readonly OverviewStat[]>(() => [
    {
      label: 'Total brands',
      value: `${this.store.brands().length}`,
      icon: 'pi pi-objects-column',
      accent: 'var(--mpa-color-primary)',
    },
    {
      label: 'Active',
      value: `${this.store.activeCount()}`,
      icon: 'pi pi-check-circle',
      accent: 'var(--mpa-color-success)',
    },
    {
      label: 'Drafts',
      value: `${this.store.draftCount()}`,
      icon: 'pi pi-pencil',
      accent: 'var(--mpa-color-warning)',
    },
    {
      label: 'Avg. health',
      value: `${this.averageHealth()}%`,
      icon: 'pi pi-heart',
      accent: 'var(--mpa-color-info)',
    },
  ]);
}
