import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { OutlineButtonComponent } from '../../buttons/enterprise-button.component';
import { EnterprisePageTitleComponent, EnterprisePageDescriptionComponent } from '../../section/enterprise-section.component';

@Component({
  selector: 'app-enterprise-dashboard-header',
  imports: [OutlineButtonComponent, EnterprisePageTitleComponent, EnterprisePageDescriptionComponent],
  template: `
    <header class="enterprise-dashboard-header">
      <div class="enterprise-dashboard-header__main">
        @if (eyebrow()) {
          <span class="enterprise-dashboard-header__eyebrow">{{ eyebrow() }}</span>
        }
        <app-enterprise-page-title [text]="title()" />
        @if (description()) {
          <app-enterprise-page-description [text]="description()" />
        }
      </div>
      <div class="enterprise-dashboard-header__aside">
        <ng-content select="[dashboardActions]" />
        @if (showRefresh()) {
          <app-outline-button
            label="Refresh"
            icon="pi pi-refresh"
            [loading]="refreshing()"
            (clicked)="refresh.emit()"
          />
        }
      </div>
    </header>
  `,
  styles: `
    .enterprise-dashboard-header {
      display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-start;
      gap: var(--mpa-spacing-md);
    }
    .enterprise-dashboard-header__eyebrow {
      display: block; margin-bottom: var(--mpa-spacing-xs);
      font-size: var(--mpa-font-size-xs); font-weight: var(--mpa-font-weight-semibold);
      letter-spacing: 0.06em; text-transform: uppercase; color: var(--mpa-color-text-muted);
    }
    .enterprise-dashboard-header__aside {
      display: flex; flex-wrap: wrap; align-items: center; gap: var(--mpa-spacing-sm);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseDashboardHeaderComponent {
  readonly eyebrow = input<string | undefined>(undefined);
  readonly title = input.required<string>();
  readonly description = input<string | undefined>(undefined);
  readonly showRefresh = input(true);
  readonly refreshing = input(false);
  readonly refresh = output<void>();
}

@Component({
  selector: 'app-enterprise-dashboard-toolbar',
  template: `
    <div class="enterprise-dashboard-toolbar" role="toolbar" [attr.aria-label]="ariaLabel()">
      <div class="enterprise-dashboard-toolbar__start">
        <ng-content select="[toolbarStart]" />
      </div>
      <div class="enterprise-dashboard-toolbar__end">
        <ng-content select="[toolbarEnd]" />
      </div>
    </div>
  `,
  styles: `
    .enterprise-dashboard-toolbar {
      display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center;
      gap: var(--mpa-spacing-md);
    }
    .enterprise-dashboard-toolbar__start,
    .enterprise-dashboard-toolbar__end {
      display: flex; flex-wrap: wrap; align-items: center; gap: var(--mpa-spacing-sm);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseDashboardToolbarComponent {
  readonly ariaLabel = input('Dashboard toolbar');
}

@Component({
  selector: 'app-enterprise-dashboard-filters',
  template: `
    <div class="enterprise-dashboard-filters" role="region" [attr.aria-label]="ariaLabel()">
      <ng-content />
    </div>
  `,
  styles: `
    .enterprise-dashboard-filters {
      display: flex; flex-wrap: wrap; align-items: flex-end; gap: var(--mpa-spacing-md);
      padding: var(--mpa-spacing-md);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-lg);
      background: var(--mpa-color-surface-muted);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseDashboardFiltersComponent {
  readonly ariaLabel = input('Dashboard filters');
}

@Component({
  selector: 'app-enterprise-dashboard-footer',
  template: `
    <footer class="enterprise-dashboard-footer" [attr.aria-label]="ariaLabel()">
      <ng-content />
    </footer>
  `,
  styles: `
    .enterprise-dashboard-footer {
      margin-top: var(--mpa-spacing-lg);
      padding-top: var(--mpa-spacing-md);
      border-top: 1px solid var(--mpa-color-border);
      font-size: var(--mpa-font-size-sm);
      color: var(--mpa-color-text-muted);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseDashboardFooterComponent {
  readonly ariaLabel = input('Dashboard footer');
}
