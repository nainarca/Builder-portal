import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { EnterpriseSpinnerComponent } from '../../loading/enterprise-loading.component';
import { IconButtonComponent } from '../../buttons/enterprise-button.component';

@Component({
  selector: 'app-enterprise-dashboard-widget',
  imports: [EnterpriseSpinnerComponent, IconButtonComponent],
  template: `
    <section
      class="enterprise-dashboard-widget"
      [class.enterprise-dashboard-widget--collapsed]="collapsed()"
      [attr.aria-label]="title()"
    >
      <header class="enterprise-dashboard-widget__header">
        <div class="enterprise-dashboard-widget__title-group">
          <h2 class="enterprise-dashboard-widget__title">
            @if (icon()) {
              <i [class]="icon()" aria-hidden="true"></i>
            }
            {{ title() }}
          </h2>
          @if (description()) {
            <p class="enterprise-dashboard-widget__description">{{ description() }}</p>
          }
        </div>
        <div class="enterprise-dashboard-widget__actions">
          <ng-content select="[widgetToolbar]" />
          @if (collapsible()) {
            <app-icon-button
              [label]="collapsed() ? 'Expand widget' : 'Collapse widget'"
              [icon]="collapsed() ? 'pi pi-chevron-down' : 'pi pi-chevron-up'"
              size="small"
              (clicked)="toggleCollapse()"
            />
          }
          @if (fullscreenCapable()) {
            <app-icon-button
              label="Fullscreen widget"
              icon="pi pi-window-maximize"
              size="small"
              (clicked)="fullscreen.emit()"
            />
          }
          @if (refreshable()) {
            <app-icon-button
              label="Refresh widget"
              icon="pi pi-refresh"
              size="small"
              [disabled]="loading()"
              (clicked)="refresh.emit()"
            />
          }
        </div>
      </header>
      @if (!collapsed()) {
        <div class="enterprise-dashboard-widget__body" [attr.aria-busy]="loading() ? 'true' : null">
          @if (loading()) {
            <div class="enterprise-dashboard-widget__loading" aria-live="polite">
              <app-enterprise-spinner ariaLabel="Loading widget" />
            </div>
          }
          <ng-content />
        </div>
        <footer class="enterprise-dashboard-widget__footer">
          <ng-content select="[widgetFooter]" />
        </footer>
      }
    </section>
  `,
  styles: `
    .enterprise-dashboard-widget {
      display: flex; flex-direction: column; gap: var(--mpa-spacing-md);
      padding: var(--mpa-spacing-md);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-lg);
      background: var(--mpa-color-surface);
      min-height: 0;
    }
    .enterprise-dashboard-widget__header {
      display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-start;
      gap: var(--mpa-spacing-sm);
    }
    .enterprise-dashboard-widget__title {
      display: flex; align-items: center; gap: var(--mpa-spacing-sm);
      margin: 0; font-size: var(--mpa-font-size-md); font-weight: var(--mpa-font-weight-semibold);
    }
    .enterprise-dashboard-widget__description {
      margin: 0.15rem 0 0; font-size: var(--mpa-font-size-sm); color: var(--mpa-color-text-muted);
    }
    .enterprise-dashboard-widget__actions {
      display: flex; flex-wrap: wrap; align-items: center; gap: var(--mpa-spacing-xs);
    }
    .enterprise-dashboard-widget__body { position: relative; min-height: 4rem; }
    .enterprise-dashboard-widget__loading {
      position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
      background: color-mix(in srgb, var(--mpa-color-surface) 80%, transparent); z-index: 1;
    }
    .enterprise-dashboard-widget__footer:empty { display: none; }
    .enterprise-dashboard-widget--collapsed .enterprise-dashboard-widget__body,
    .enterprise-dashboard-widget--collapsed .enterprise-dashboard-widget__footer { display: none; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseDashboardWidgetComponent {
  readonly title = input.required<string>();
  readonly description = input<string | undefined>(undefined);
  readonly icon = input<string | undefined>(undefined);
  readonly refreshable = input(false);
  readonly collapsible = input(false);
  readonly fullscreenCapable = input(false);
  readonly loading = input(false);
  readonly collapsed = input(false);

  readonly refresh = output<void>();
  readonly fullscreen = output<void>();
  readonly collapsedChange = output<boolean>();

  toggleCollapse(): void {
    this.collapsedChange.emit(!this.collapsed());
  }
}
