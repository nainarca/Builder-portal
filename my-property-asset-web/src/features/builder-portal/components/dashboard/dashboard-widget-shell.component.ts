import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { SpinnerComponent } from '@shared/ui';

@Component({
  selector: 'app-bp-dashboard-widget-shell',
  imports: [SpinnerComponent],
  template: `
    <section class="bp-dashboard-widget" [attr.aria-label]="title()">
      <header class="bp-dashboard-widget__header">
        <div class="bp-dashboard-widget__title-group">
          <h2 class="bp-dashboard-widget__title">
            @if (icon()) {
              <i [class]="icon()" aria-hidden="true"></i>
            }
            {{ title() }}
          </h2>
          @if (description()) {
            <p class="bp-dashboard-widget__description">{{ description() }}</p>
          }
        </div>
        <div class="bp-dashboard-widget__actions">
          <ng-content select="[widgetActions]" />
          @if (refreshable()) {
            <button
              type="button"
              class="bp-dashboard-widget__refresh"
              [class.bp-dashboard-widget__refresh--loading]="loading()"
              [attr.aria-label]="'Refresh ' + title()"
              [disabled]="loading()"
              (click)="refresh.emit()"
            >
              <i class="pi pi-refresh" aria-hidden="true"></i>
            </button>
          }
        </div>
      </header>
      <div class="bp-dashboard-widget__body">
        @if (loading()) {
          <div class="bp-dashboard-widget__loading" aria-live="polite">
            <app-spinner diameter="2rem" ariaLabel="Loading widget" />
          </div>
        }
        <ng-content />
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardWidgetShellComponent {
  readonly title = input.required<string>();
  readonly description = input<string | undefined>(undefined);
  readonly icon = input<string | undefined>(undefined);
  readonly refreshable = input(false);
  readonly loading = input(false);

  readonly refresh = output<void>();
}
