import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { BrandAdminRecord } from '../../models/brand-admin.model';

@Component({
  selector: 'app-wl-brand-card',
  template: `
    @if (brand(); as record) {
      <button type="button" class="wl-brand-card" [class.wl-brand-card--selected]="selected()" (click)="selectBrand.emit(record.id)">
        <span class="wl-brand-card__swatch" [style.background]="record.colors.primary" aria-hidden="true"></span>
        <span class="wl-brand-card__body">
          <span class="wl-brand-card__name">{{ record.identity.applicationName }}</span>
          <span class="wl-brand-card__type">{{ record.type }}</span>
        </span>
        <span class="wl-brand-card__meta">
          <span class="wl-brand-card__health" [class]="healthClass()">{{ record.healthScore }}%</span>
          <span class="wl-brand-card__status" [class]="statusClass()">{{ record.status }}</span>
        </span>
      </button>
    }
  `,
  styles: `
    .wl-brand-card {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      text-align: left;
      padding: 0.85rem 1rem;
      background: var(--mpa-color-surface);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-md, 0.5rem);
      cursor: pointer;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }
    .wl-brand-card:hover {
      border-color: var(--mpa-color-primary);
    }
    .wl-brand-card--selected {
      border-color: var(--mpa-color-primary);
      box-shadow: 0 0 0 1px var(--mpa-color-primary);
    }
    .wl-brand-card__swatch {
      width: 2.25rem;
      height: 2.25rem;
      border-radius: var(--mpa-radius-sm, 0.375rem);
      border: 1px solid var(--mpa-color-border);
      flex: none;
    }
    .wl-brand-card__body {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
      flex: 1;
      min-width: 0;
    }
    .wl-brand-card__name {
      font-weight: 600;
      color: var(--mpa-color-text);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .wl-brand-card__type {
      font-size: var(--mpa-font-size-xs, 0.75rem);
      color: var(--mpa-color-text-muted);
      text-transform: capitalize;
    }
    .wl-brand-card__meta {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.3rem;
    }
    .wl-brand-card__health {
      font-weight: 600;
      font-size: var(--mpa-font-size-sm, 0.875rem);
    }
    .wl-brand-card__health--good { color: var(--mpa-color-success); }
    .wl-brand-card__health--warn { color: var(--mpa-color-warning); }
    .wl-brand-card__health--poor { color: var(--mpa-color-danger); }
    .wl-brand-card__status {
      font-size: var(--mpa-font-size-xs, 0.75rem);
      text-transform: capitalize;
      padding: 0.1rem 0.5rem;
      border-radius: 999px;
      border: 1px solid var(--mpa-color-border);
    }
    .wl-brand-card__status--active { color: var(--mpa-color-success); border-color: var(--mpa-color-success); }
    .wl-brand-card__status--draft { color: var(--mpa-color-warning); border-color: var(--mpa-color-warning); }
    .wl-brand-card__status--archived { color: var(--mpa-color-text-muted); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WlBrandCardComponent {
  readonly brand = input.required<BrandAdminRecord>();
  readonly selected = input(false);
  readonly selectBrand = output<string>();

  readonly healthClass = computed(() => {
    const score = this.brand().healthScore;
    if (score >= 85) return 'wl-brand-card__health wl-brand-card__health--good';
    if (score >= 60) return 'wl-brand-card__health wl-brand-card__health--warn';
    return 'wl-brand-card__health wl-brand-card__health--poor';
  });

  readonly statusClass = computed(
    () => `wl-brand-card__status wl-brand-card__status--${this.brand().status}`,
  );
}
