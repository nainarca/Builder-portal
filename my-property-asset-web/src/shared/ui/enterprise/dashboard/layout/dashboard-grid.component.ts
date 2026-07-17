import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { EnterpriseDashboardGridItemConfig } from '../models/enterprise-dashboard.models';

@Component({
  selector: 'app-enterprise-dashboard-grid',
  template: `
    <div
      class="enterprise-dashboard-grid"
      [class.enterprise-dashboard-grid--analytics]="mode() === 'analytics'"
      role="region"
      [attr.aria-label]="ariaLabel()"
    >
      <ng-content />
    </div>
  `,
  styles: `
    .enterprise-dashboard-grid {
      display: grid;
      grid-template-columns: repeat(12, minmax(0, 1fr));
      gap: var(--mpa-spacing-lg);
      width: 100%;
    }
    .enterprise-dashboard-grid--analytics {
      gap: var(--mpa-spacing-xl);
    }
    @media (max-width: 1024px) {
      .enterprise-dashboard-grid { grid-template-columns: repeat(6, minmax(0, 1fr)); }
    }
    @media (max-width: 640px) {
      .enterprise-dashboard-grid { grid-template-columns: 1fr; }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseDashboardGridComponent {
  readonly mode = input<'dashboard' | 'analytics'>('dashboard');
  readonly ariaLabel = input('Dashboard widgets');
}

@Component({
  selector: 'app-enterprise-dashboard-grid-item',
  template: `<div class="enterprise-dashboard-grid-item" [style.grid-column]="columnSpan()" [style.grid-row]="rowSpan()"><ng-content /></div>`,
  styles: `
    .enterprise-dashboard-grid-item { min-width: 0; }
    @media (max-width: 640px) {
      .enterprise-dashboard-grid-item { grid-column: 1 / -1 !important; }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseDashboardGridItemComponent {
  readonly config = input<EnterpriseDashboardGridItemConfig>({ colspan: 1, rowspan: 1 });

  columnSpan(): string {
    const span = this.config().colspan ?? 1;
    return `span ${Math.min(span, 12)}`;
  }

  rowSpan(): string {
    const span = this.config().rowspan ?? 1;
    return `span ${span}`;
  }
}

@Component({
  selector: 'app-enterprise-dashboard-section',
  template: `
    <section class="enterprise-dashboard-section" role="region" [attr.aria-label]="title()">
      @if (title()) {
        <h2 class="enterprise-dashboard-section__title">{{ title() }}</h2>
      }
      @if (description()) {
        <p class="enterprise-dashboard-section__description">{{ description() }}</p>
      }
      <ng-content />
    </section>
  `,
  styles: `
    .enterprise-dashboard-section {
      display: flex; flex-direction: column; gap: var(--mpa-spacing-md);
    }
    .enterprise-dashboard-section__title {
      margin: 0; font-size: var(--mpa-font-size-lg); font-weight: var(--mpa-font-weight-semibold);
    }
    .enterprise-dashboard-section__description {
      margin: 0; font-size: var(--mpa-font-size-sm); color: var(--mpa-color-text-muted);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseDashboardSectionComponent {
  readonly title = input<string | undefined>(undefined);
  readonly description = input<string | undefined>(undefined);
}

@Component({
  selector: 'app-enterprise-dashboard-kpi-strip',
  template: `
    <div
      class="enterprise-dashboard-kpi-strip"
      role="region"
      [attr.aria-label]="ariaLabel()"
    >
      <ng-content />
    </div>
  `,
  styles: `
    .enterprise-dashboard-kpi-strip {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
      gap: var(--mpa-spacing-md);
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      padding-bottom: var(--mpa-spacing-xs);
    }
    @media (max-width: 640px) {
      .enterprise-dashboard-kpi-strip {
        display: flex;
        flex-wrap: nowrap;
        scroll-snap-type: x mandatory;
      }
      .enterprise-dashboard-kpi-strip > * {
        flex: 0 0 min(75vw, 14rem);
        scroll-snap-align: start;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseDashboardKpiStripComponent {
  readonly ariaLabel = input('Key performance indicators');
}

@Component({
  selector: 'app-enterprise-dashboard-quick-actions',
  template: `
    <div class="enterprise-dashboard-quick-actions" role="region" [attr.aria-label]="ariaLabel()">
      <ng-content />
    </div>
  `,
  styles: `
    .enterprise-dashboard-quick-actions {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
      gap: var(--mpa-spacing-md);
      max-width: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseDashboardQuickActionsZoneComponent {
  readonly ariaLabel = input('Quick actions');
}
