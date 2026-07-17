import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { CardComponent } from '../../composites/cards/card.component';
import { EnterpriseButtonComponent } from '../buttons/enterprise-button.component';
import type { EnterpriseDetailAction } from './models/enterprise-detail.models';

/**
 * Quick actions + optional danger zone (archive / delete / restore).
 * Permission visibility is owned by the parent (do not change RBAC here).
 */
@Component({
  selector: 'app-enterprise-detail-action-panel',
  imports: [CardComponent, EnterpriseButtonComponent],
  template: `
    <app-card variant="outlined">
      <div class="enterprise-detail-actions">
        @if (title()) {
          <h3 class="enterprise-detail-actions__title">{{ title() }}</h3>
        }
        @if (actions().length) {
          <div class="enterprise-detail-actions__list" role="group" [attr.aria-label]="title() || 'Quick actions'">
            @for (action of actions(); track action.id) {
              <app-enterprise-button
                [variant]="action.severity === 'danger' ? 'danger' : 'outline'"
                [label]="action.label"
                [icon]="action.icon"
                [disabled]="action.disabled ?? false"
                (clicked)="actionClick.emit(action.id)"
              />
            }
          </div>
        }
        <ng-content />

        @if (dangerActions().length) {
          <div class="enterprise-detail-actions__danger" role="group" aria-label="Danger zone">
            <h4 class="enterprise-detail-actions__danger-title">Danger zone</h4>
            @if (dangerDescription()) {
              <p class="enterprise-detail-actions__danger-description">{{ dangerDescription() }}</p>
            }
            <div class="enterprise-detail-actions__list">
              @for (action of dangerActions(); track action.id) {
                <app-enterprise-button
                  variant="danger"
                  [label]="action.label"
                  [icon]="action.icon"
                  [disabled]="action.disabled ?? false"
                  (clicked)="actionClick.emit(action.id)"
                />
              }
            </div>
          </div>
        }
      </div>
    </app-card>
  `,
  styles: `
    .enterprise-detail-actions {
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-md);
    }
    .enterprise-detail-actions__title {
      margin: 0;
      font-size: var(--mpa-font-size-md);
      font-weight: var(--mpa-font-weight-semibold);
    }
    .enterprise-detail-actions__list {
      display: flex;
      flex-wrap: wrap;
      gap: var(--mpa-spacing-sm);
    }
    .enterprise-detail-actions__danger {
      padding-top: var(--mpa-spacing-md);
      border-top: 1px solid var(--mpa-color-border);
    }
    .enterprise-detail-actions__danger-title {
      margin: 0 0 var(--mpa-spacing-xs);
      font-size: var(--mpa-font-size-sm);
      font-weight: var(--mpa-font-weight-semibold);
      color: var(--mpa-color-danger);
    }
    .enterprise-detail-actions__danger-description {
      margin: 0 0 var(--mpa-spacing-sm);
      font-size: var(--mpa-font-size-sm);
      color: var(--mpa-color-text-muted);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseDetailActionPanelComponent {
  readonly title = input<string | undefined>('Quick actions');
  readonly actions = input<readonly EnterpriseDetailAction[]>([]);
  readonly dangerActions = input<readonly EnterpriseDetailAction[]>([]);
  readonly dangerDescription = input<string | undefined>(undefined);

  readonly actionClick = output<string>();
}

/** Alias for dashboard-style naming in deliverables. */
@Component({
  selector: 'app-enterprise-quick-actions-panel',
  imports: [EnterpriseDetailActionPanelComponent],
  template: `
    <app-enterprise-detail-action-panel
      [title]="title()"
      [actions]="actions()"
      [dangerActions]="dangerActions()"
      [dangerDescription]="dangerDescription()"
      (actionClick)="actionClick.emit($event)"
    >
      <ng-content />
    </app-enterprise-detail-action-panel>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseQuickActionsPanelComponent {
  readonly title = input<string | undefined>('Quick actions');
  readonly actions = input<readonly EnterpriseDetailAction[]>([]);
  readonly dangerActions = input<readonly EnterpriseDetailAction[]>([]);
  readonly dangerDescription = input<string | undefined>(undefined);
  readonly actionClick = output<string>();
}
