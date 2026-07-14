import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { formatOpsDate } from '../../config/operations.config';
import { OpsAlertRecord } from '../../models/operations-admin.model';
import { OpsStatusBadgeComponent } from './ops-status-badge.component';

@Component({
  selector: 'app-ops-alert-card',
  imports: [OpsStatusBadgeComponent],
  template: `
    @if (alert(); as a) {
      <article class="ops-alert-card" [class.ops-alert-card--acked]="a.acknowledged">
        <header class="ops-alert-card__head">
          <app-ops-status-badge [status]="a.severity" />
          <time class="ops-alert-card__time">{{ formatDate(a.createdAt) }}</time>
        </header>
        <h3 class="ops-alert-card__title">{{ a.title }}</h3>
        <p class="ops-alert-card__message">{{ a.message }}</p>
        <footer class="ops-alert-card__foot">
          <span class="ops-alert-card__source">{{ a.source }}@if (a.organizationName) { · {{ a.organizationName }} }</span>
          @if (!a.acknowledged) {
            <button type="button" class="ops-alert-card__action" (click)="acknowledge.emit(a.id)">Acknowledge</button>
          } @else {
            <span class="ops-alert-card__acked">Acknowledged</span>
          }
        </footer>
      </article>
    }
  `,
  styles: `
    .ops-alert-card {
      display: flex;
      flex-direction: column;
      gap: 0.55rem;
      padding: 1.1rem;
      background: var(--mpa-color-surface);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-md, 0.5rem);
      border-left: 3px solid var(--mpa-color-warning, #d97706);
    }
    .ops-alert-card--acked { opacity: 0.72; border-left-color: var(--mpa-color-border); }
    .ops-alert-card__head { display: flex; justify-content: space-between; gap: 0.5rem; align-items: center; }
    .ops-alert-card__time { font-size: var(--mpa-font-size-xs, 0.75rem); color: var(--mpa-color-text-muted); }
    .ops-alert-card__title { margin: 0; font-size: var(--mpa-font-size-md, 1rem); font-weight: 600; color: var(--mpa-color-text); }
    .ops-alert-card__message { margin: 0; font-size: var(--mpa-font-size-sm, 0.875rem); color: var(--mpa-color-text-muted); line-height: 1.45; }
    .ops-alert-card__foot { display: flex; justify-content: space-between; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
    .ops-alert-card__source { font-size: var(--mpa-font-size-xs, 0.75rem); color: var(--mpa-color-text-muted); }
    .ops-alert-card__action {
      border: 1px solid var(--mpa-color-border);
      background: var(--mpa-color-surface);
      color: var(--mpa-color-primary);
      border-radius: var(--mpa-radius-sm, 0.375rem);
      padding: 0.35rem 0.7rem;
      font-size: var(--mpa-font-size-xs, 0.75rem);
      font-weight: 600;
      cursor: pointer;
    }
    .ops-alert-card__action:hover { border-color: var(--mpa-color-primary); }
    .ops-alert-card__acked { font-size: var(--mpa-font-size-xs, 0.75rem); color: var(--mpa-color-success, #16a34a); font-weight: 600; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpsAlertCardComponent {
  readonly alert = input.required<OpsAlertRecord>();
  readonly acknowledge = output<string>();
  formatDate = formatOpsDate;
}
