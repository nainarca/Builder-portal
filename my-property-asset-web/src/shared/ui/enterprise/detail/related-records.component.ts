import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CardComponent } from '../../composites/cards/card.component';
import { StatusBadgeComponent } from '../../composites/notification/status-badge.component';
import { EnterpriseButtonComponent } from '../buttons/enterprise-button.component';
import { EmptyNoDataComponent } from '../empty-states/enterprise-empty-states.component';
import type { EnterpriseDetailRelatedItem } from './models/enterprise-detail.models';

/** Reusable related-records list for detail tabs / asides (UI-REBIRTH §5). */
@Component({
  selector: 'app-enterprise-related-records',
  imports: [CardComponent, RouterLink, StatusBadgeComponent, EnterpriseButtonComponent, EmptyNoDataComponent],
  template: `
    <app-card variant="outlined">
      <div class="enterprise-related-records">
        <div class="enterprise-related-records__header">
          <div>
            <h3 class="enterprise-related-records__title">{{ title() }}</h3>
            @if (description()) {
              <p class="enterprise-related-records__description">{{ description() }}</p>
            }
          </div>
          @if (actionLabel()) {
            <app-enterprise-button
              variant="outline"
              [label]="actionLabel()!"
              [icon]="actionIcon()"
              (clicked)="action.emit($event)"
            />
          }
        </div>

        @if (items().length === 0) {
          <app-empty-no-data
            [title]="emptyTitle()"
            [description]="emptyDescription()"
            [actionLabel]="emptyActionLabel()"
            (action)="emptyAction.emit($event)"
          />
        } @else {
          <ul class="enterprise-related-records__list" [attr.aria-label]="title()">
            @for (item of items(); track item.id) {
              <li class="enterprise-related-records__item">
                @if (item.href) {
                  <a class="enterprise-related-records__link mpa-focus-visible" [routerLink]="item.href">
                    <span class="enterprise-related-records__item-title">{{ item.title }}</span>
                    @if (item.subtitle) {
                      <span class="enterprise-related-records__item-subtitle">{{ item.subtitle }}</span>
                    }
                  </a>
                } @else {
                  <div class="enterprise-related-records__static">
                    <span class="enterprise-related-records__item-title">{{ item.title }}</span>
                    @if (item.subtitle) {
                      <span class="enterprise-related-records__item-subtitle">{{ item.subtitle }}</span>
                    }
                  </div>
                }
                <div class="enterprise-related-records__meta">
                  @if (item.statusLabel) {
                    <app-status-badge
                      [label]="item.statusLabel"
                      [severity]="item.statusSeverity ?? 'secondary'"
                    />
                  }
                  @if (item.meta) {
                    <span>{{ item.meta }}</span>
                  }
                </div>
              </li>
            }
          </ul>
        }
      </div>
    </app-card>
  `,
  styles: `
    .enterprise-related-records {
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-md);
    }
    .enterprise-related-records__header {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      justify-content: space-between;
      gap: var(--mpa-spacing-sm);
    }
    .enterprise-related-records__title {
      margin: 0;
      font-size: var(--mpa-font-size-md);
      font-weight: var(--mpa-font-weight-semibold);
    }
    .enterprise-related-records__description {
      margin: var(--mpa-spacing-xs) 0 0;
      font-size: var(--mpa-font-size-sm);
      color: var(--mpa-color-text-muted);
    }
    .enterprise-related-records__list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-sm);
    }
    .enterprise-related-records__item {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: var(--mpa-spacing-sm);
      padding: var(--mpa-spacing-sm) 0;
      border-bottom: 1px solid var(--mpa-color-border);
    }
    .enterprise-related-records__item:last-child {
      border-bottom: 0;
    }
    .enterprise-related-records__link,
    .enterprise-related-records__static {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
      min-width: 0;
      text-decoration: none;
      color: inherit;
    }
    .enterprise-related-records__link:hover .enterprise-related-records__item-title {
      color: var(--mpa-color-primary);
    }
    .enterprise-related-records__item-title {
      font-size: var(--mpa-font-size-sm);
      font-weight: var(--mpa-font-weight-medium);
    }
    .enterprise-related-records__item-subtitle,
    .enterprise-related-records__meta {
      font-size: var(--mpa-font-size-xs);
      color: var(--mpa-color-text-muted);
    }
    .enterprise-related-records__meta {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--mpa-spacing-sm);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseRelatedRecordsComponent {
  readonly title = input.required<string>();
  readonly description = input<string | undefined>(undefined);
  readonly items = input<readonly EnterpriseDetailRelatedItem[]>([]);
  readonly actionLabel = input<string | undefined>(undefined);
  readonly actionIcon = input<string | undefined>('pi pi-arrow-right');
  readonly emptyTitle = input('No related records');
  readonly emptyDescription = input<string | undefined>('Related records will appear here when available.');
  readonly emptyActionLabel = input<string | undefined>(undefined);

  readonly action = output<MouseEvent>();
  readonly emptyAction = output<MouseEvent>();
}
