import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { StatusBadgeComponent } from '../../composites/notification/status-badge.component';
import { EnterpriseDetailOverflowMenuComponent } from './detail-overflow-menu.component';
import type {
  EnterpriseDetailAction,
  EnterpriseDetailFact,
  EnterpriseDetailStat,
} from './models/enterprise-detail.models';

/**
 * Entity hero — name + status chip + key facts + one primary action + overflow.
 * UI-REBIRTH §5 / P0.1 §2.7.
 */
@Component({
  selector: 'app-enterprise-entity-hero',
  imports: [StatusBadgeComponent, EnterpriseDetailOverflowMenuComponent],
  template: `
    <header class="enterprise-entity-hero" [attr.aria-label]="ariaLabel()">
      <div class="enterprise-entity-hero__main">
        <div class="enterprise-entity-hero__leading">
          <ng-content select="[entityHeroLeading]" />
        </div>
        <div class="enterprise-entity-hero__identity">
          @if (eyebrow()) {
            <p class="enterprise-entity-hero__eyebrow">{{ eyebrow() }}</p>
          }
          <div class="enterprise-entity-hero__title-row">
            <h1 class="enterprise-entity-hero__title">{{ title() }}</h1>
            @if (statusLabel()) {
              <app-status-badge
                [label]="statusLabel()!"
                [severity]="statusSeverity()"
                [icon]="statusIcon()"
              />
            }
            <ng-content select="[entityHeroBadges]" />
          </div>
          @if (subtitle()) {
            <p class="enterprise-entity-hero__subtitle">{{ subtitle() }}</p>
          }
          @if (identifier()) {
            <p class="enterprise-entity-hero__identifier">
              <span class="enterprise-entity-hero__identifier-label">ID</span>
              <code>{{ identifier() }}</code>
            </p>
          }
          @if (facts().length) {
            <dl class="enterprise-entity-hero__facts">
              @for (fact of facts(); track fact.label) {
                <div class="enterprise-entity-hero__fact">
                  <dt>{{ fact.label }}</dt>
                  <dd>{{ fact.value }}</dd>
                </div>
              }
            </dl>
          }
        </div>
      </div>

      <div class="enterprise-entity-hero__actions">
        <ng-content select="[entityHeroPrimary]" />
        <ng-content select="[entityHeroSecondary]" />
        @if (overflowActions().length) {
          <app-enterprise-detail-overflow-menu
            [actions]="overflowActions()"
            (actionClick)="overflowAction.emit($event)"
          />
        }
      </div>

      @if (stats().length) {
        <ul class="enterprise-entity-hero__stats" aria-label="Quick statistics">
          @for (stat of stats(); track stat.id) {
            <li class="enterprise-entity-hero__stat">
              <span class="enterprise-entity-hero__stat-value">{{ stat.value }}</span>
              <span class="enterprise-entity-hero__stat-label">{{ stat.label }}</span>
            </li>
          }
        </ul>
      }
    </header>
  `,
  styles: `
    .enterprise-entity-hero {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      justify-content: space-between;
      gap: var(--mpa-spacing-lg);
      padding: var(--mpa-spacing-lg);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-lg);
      background: var(--mpa-color-surface);
      box-shadow: var(--mpa-elevation-sm, none);
    }
    .enterprise-entity-hero__main {
      display: flex;
      gap: var(--mpa-spacing-lg);
      align-items: flex-start;
      min-width: 0;
      flex: 1 1 16rem;
    }
    .enterprise-entity-hero__leading {
      flex-shrink: 0;
    }
    .enterprise-entity-hero__leading:empty {
      display: none;
    }
    .enterprise-entity-hero__identity {
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-xs);
      min-width: 0;
    }
    .enterprise-entity-hero__eyebrow {
      margin: 0;
      font-size: var(--mpa-font-size-xs);
      font-weight: var(--mpa-font-weight-semibold);
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--mpa-color-text-muted);
    }
    .enterprise-entity-hero__title-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--mpa-spacing-sm);
    }
    .enterprise-entity-hero__title {
      margin: 0;
      font-size: var(--mpa-font-size-2xl, 1.75rem);
      font-weight: var(--mpa-font-weight-semibold);
      line-height: var(--mpa-line-height-tight, 1.2);
      color: var(--mpa-color-text);
    }
    .enterprise-entity-hero__subtitle {
      margin: 0;
      font-size: var(--mpa-font-size-md);
      color: var(--mpa-color-text-muted);
    }
    .enterprise-entity-hero__identifier {
      margin: 0;
      display: flex;
      align-items: center;
      gap: var(--mpa-spacing-xs);
      font-size: var(--mpa-font-size-sm);
      color: var(--mpa-color-text-muted);
    }
    .enterprise-entity-hero__identifier-label {
      font-weight: var(--mpa-font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      font-size: var(--mpa-font-size-xs);
    }
    .enterprise-entity-hero__identifier code {
      font-family: var(--mpa-font-family-mono, ui-monospace, monospace);
      font-size: var(--mpa-font-size-sm);
    }
    .enterprise-entity-hero__facts {
      display: flex;
      flex-wrap: wrap;
      gap: var(--mpa-spacing-md);
      margin: var(--mpa-spacing-sm) 0 0;
    }
    .enterprise-entity-hero__fact {
      margin: 0;
    }
    .enterprise-entity-hero__fact dt {
      margin: 0;
      font-size: var(--mpa-font-size-xs);
      color: var(--mpa-color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .enterprise-entity-hero__fact dd {
      margin: 0.15rem 0 0;
      font-size: var(--mpa-font-size-sm);
      font-weight: var(--mpa-font-weight-medium);
    }
    .enterprise-entity-hero__actions {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--mpa-spacing-sm);
      flex-shrink: 0;
    }
    .enterprise-entity-hero__stats {
      list-style: none;
      margin: 0;
      padding: var(--mpa-spacing-md) 0 0;
      width: 100%;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(6.5rem, 1fr));
      gap: var(--mpa-spacing-md);
      border-top: 1px solid var(--mpa-color-border);
    }
    .enterprise-entity-hero__stat {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }
    .enterprise-entity-hero__stat-value {
      font-size: var(--mpa-font-size-lg);
      font-weight: var(--mpa-font-weight-semibold);
    }
    .enterprise-entity-hero__stat-label {
      font-size: var(--mpa-font-size-xs);
      color: var(--mpa-color-text-muted);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseEntityHeroComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string | undefined>(undefined);
  readonly eyebrow = input<string | undefined>(undefined);
  readonly identifier = input<string | undefined>(undefined);
  readonly statusLabel = input<string | undefined>(undefined);
  readonly statusSeverity = input<'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'>(
    'secondary',
  );
  readonly statusIcon = input<string | undefined>(undefined);
  readonly facts = input<readonly EnterpriseDetailFact[]>([]);
  readonly stats = input<readonly EnterpriseDetailStat[]>([]);
  readonly overflowActions = input<readonly EnterpriseDetailAction[]>([]);
  readonly ariaLabel = input('Entity header');

  readonly overflowAction = output<string>();
}
