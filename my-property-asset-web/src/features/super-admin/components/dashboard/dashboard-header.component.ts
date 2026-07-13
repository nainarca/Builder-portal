import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { ButtonComponent } from '@shared/ui';

@Component({
  selector: 'app-sa-dashboard-header',
  imports: [ButtonComponent],
  template: `
    <header class="sa-dashboard-header">
      <div class="sa-dashboard-header__main">
        @if (eyebrow()) {
          <span class="mpa-eyebrow">{{ eyebrow() }}</span>
        }
        <h1 class="ui-page-title">{{ title() }}</h1>
        @if (description()) {
          <p class="ui-page-subtitle">{{ description() }}</p>
        }
      </div>
      <div class="sa-dashboard-header__aside">
        <ng-content select="[dashboardActions]" />
        @if (showRefresh()) {
          <app-button
            label="Refresh"
            icon="pi pi-refresh"
            [outlined]="true"
            [loading]="refreshing()"
            (clicked)="refresh.emit()"
          />
        }
      </div>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardHeaderComponent {
  readonly eyebrow = input<string | undefined>(undefined);
  readonly title = input.required<string>();
  readonly description = input<string | undefined>(undefined);
  readonly showRefresh = input(true);
  readonly refreshing = input(false);

  readonly refresh = output<void>();
}
