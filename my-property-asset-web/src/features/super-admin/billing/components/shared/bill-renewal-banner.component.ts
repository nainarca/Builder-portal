import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-bill-renewal-banner',
  imports: [RouterLink],
  template: `
    <aside [class]="'bill-renewal-banner bill-renewal-banner--' + severity()" role="status">
      <div class="bill-renewal-banner__icon" aria-hidden="true">
        <i [class]="severityIcon()"></i>
      </div>

      <div class="bill-renewal-banner__content">
        <h3 class="bill-renewal-banner__title">{{ title() }}</h3>
        <p class="bill-renewal-banner__message">{{ message() }}</p>
        @if (actionLabel() && actionRoute()) {
          <a class="bill-renewal-banner__action" [routerLink]="actionRoute()">
            {{ actionLabel() }}
            <i class="pi pi-arrow-right" aria-hidden="true"></i>
          </a>
        }
      </div>

      @if (dismissible()) {
        <button
          type="button"
          class="bill-renewal-banner__dismiss"
          aria-label="Dismiss banner"
          (click)="dismiss.emit()"
        >
          <i class="pi pi-times" aria-hidden="true"></i>
        </button>
      }
    </aside>
  `,
  styles: `
    .bill-renewal-banner {
      display: flex;
      align-items: flex-start;
      gap: 0.85rem;
      padding: var(--mpa-spacing-md, 1.15rem);
      background: var(--mpa-color-surface);
      border: 1px solid var(--mpa-color-border);
      border-left-width: 3px;
      border-radius: var(--mpa-radius-md, 0.5rem);
    }

    .bill-renewal-banner--info {
      border-left-color: var(--mpa-color-primary);
    }

    .bill-renewal-banner--warning {
      border-left-color: var(--mpa-color-warning);
    }

    .bill-renewal-banner--critical {
      border-left-color: var(--mpa-color-danger);
    }

    .bill-renewal-banner__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2rem;
      height: 2rem;
      flex: none;
      border-radius: var(--mpa-radius-sm, 0.375rem);
      font-size: 1rem;
    }

    .bill-renewal-banner--info .bill-renewal-banner__icon {
      background: color-mix(in srgb, var(--mpa-color-primary) 12%, transparent);
      color: var(--mpa-color-primary);
    }

    .bill-renewal-banner--warning .bill-renewal-banner__icon {
      background: color-mix(in srgb, var(--mpa-color-warning) 14%, transparent);
      color: var(--mpa-color-warning);
    }

    .bill-renewal-banner--critical .bill-renewal-banner__icon {
      background: color-mix(in srgb, var(--mpa-color-danger) 12%, transparent);
      color: var(--mpa-color-danger);
    }

    .bill-renewal-banner__content {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }

    .bill-renewal-banner__title {
      margin: 0;
      font-size: var(--mpa-font-size-md, 1rem);
      font-weight: 700;
      color: var(--mpa-color-text);
    }

    .bill-renewal-banner__message {
      margin: 0;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      line-height: 1.45;
      color: var(--mpa-color-text-muted);
    }

    .bill-renewal-banner__action {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      margin-top: 0.35rem;
      width: fit-content;
      color: var(--mpa-color-primary);
      text-decoration: none;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      font-weight: 600;
    }

    .bill-renewal-banner__dismiss {
      flex: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.75rem;
      height: 1.75rem;
      border: 0;
      border-radius: var(--mpa-radius-sm, 0.375rem);
      background: transparent;
      color: var(--mpa-color-text-muted);
      cursor: pointer;
    }

    .bill-renewal-banner__dismiss:hover {
      background: color-mix(in srgb, var(--mpa-color-text-muted) 12%, transparent);
      color: var(--mpa-color-text);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillRenewalBannerComponent {
  readonly title = input.required<string>();
  readonly message = input.required<string>();
  readonly severity = input<'info' | 'warning' | 'critical'>('info');
  readonly actionLabel = input<string | undefined>(undefined);
  readonly actionRoute = input<string | undefined>(undefined);
  readonly dismissible = input(false);

  readonly dismiss = output<void>();

  severityIcon(): string {
    switch (this.severity()) {
      case 'critical':
        return 'pi pi-exclamation-circle';
      case 'warning':
        return 'pi pi-exclamation-triangle';
      default:
        return 'pi pi-info-circle';
    }
  }
}
