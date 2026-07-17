import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { CardComponent } from '../../composites/cards/card.component';
import { StatusBadgeComponent } from '../../composites/notification/status-badge.component';

export interface EnterpriseReviewFact {
  readonly label: string;
  readonly value: string;
}

/**
 * Review summary — richer than a bare DL (UI-REBIRTH §7).
 * Optional record-preview chrome for the final wizard beat.
 */
@Component({
  selector: 'app-enterprise-review-summary',
  imports: [CardComponent, StatusBadgeComponent],
  template: `
    <div class="enterprise-review-summary">
      @if (previewTitle()) {
        <app-card variant="outlined">
          <div class="enterprise-review-summary__preview" aria-label="Record preview">
            <div class="enterprise-review-summary__preview-leading">
              <ng-content select="[reviewPreviewLeading]" />
              <span class="enterprise-review-summary__avatar" aria-hidden="true">
                <i [class]="previewIcon() || 'pi pi-file'"></i>
              </span>
            </div>
            <div class="enterprise-review-summary__preview-body">
              @if (previewEyebrow()) {
                <p class="enterprise-review-summary__eyebrow">{{ previewEyebrow() }}</p>
              }
              <div class="enterprise-review-summary__title-row">
                <h3 class="enterprise-review-summary__preview-title">{{ previewTitle() }}</h3>
                @if (statusLabel()) {
                  <app-status-badge
                    [label]="statusLabel()!"
                    [severity]="statusSeverity()"
                  />
                }
              </div>
              @if (previewSubtitle()) {
                <p class="enterprise-review-summary__preview-subtitle">{{ previewSubtitle() }}</p>
              }
            </div>
          </div>
        </app-card>
      }

      <app-card variant="default">
        @if (title()) {
          <h3 class="enterprise-review-summary__title">{{ title() }}</h3>
        }
        @if (description()) {
          <p class="enterprise-review-summary__description">{{ description() }}</p>
        }
        <dl class="enterprise-review-summary__facts" [attr.aria-label]="title() || 'Review details'">
          @for (fact of facts(); track fact.label) {
            <div class="enterprise-review-summary__fact">
              <dt>{{ fact.label }}</dt>
              <dd>{{ fact.value || '—' }}</dd>
            </div>
          }
        </dl>
        <ng-content />
      </app-card>
    </div>
  `,
  styles: `
    .enterprise-review-summary {
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-md);
    }
    .enterprise-review-summary__preview {
      display: flex;
      gap: var(--mpa-spacing-md);
      align-items: flex-start;
    }
    .enterprise-review-summary__preview-leading:has([reviewPreviewLeading]) .enterprise-review-summary__avatar,
    .enterprise-review-summary__preview-leading:not(:empty) .enterprise-review-summary__avatar {
      display: none;
    }
    .enterprise-review-summary__avatar {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--mpa-avatar-size-xl);
      height: var(--mpa-avatar-size-xl);
      border-radius: var(--mpa-radius-lg);
      background: var(--mpa-color-primary-subtle, var(--mpa-color-surface-muted));
      color: var(--mpa-color-primary);
      font-size: 1.25rem;
    }
    .enterprise-review-summary__eyebrow {
      margin: 0;
      font-size: var(--mpa-font-size-xs);
      font-weight: var(--mpa-font-weight-semibold);
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--mpa-color-text-muted);
    }
    .enterprise-review-summary__title-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--mpa-spacing-sm);
    }
    .enterprise-review-summary__preview-title {
      margin: 0;
      font-size: var(--mpa-font-size-lg);
      font-weight: var(--mpa-font-weight-semibold);
    }
    .enterprise-review-summary__preview-subtitle {
      margin: var(--mpa-spacing-xs) 0 0;
      font-size: var(--mpa-font-size-sm);
      color: var(--mpa-color-text-muted);
    }
    .enterprise-review-summary__title {
      margin: 0 0 var(--mpa-spacing-xs);
      font-size: var(--mpa-font-size-md);
      font-weight: var(--mpa-font-weight-semibold);
    }
    .enterprise-review-summary__description {
      margin: 0 0 var(--mpa-spacing-md);
      font-size: var(--mpa-font-size-sm);
      color: var(--mpa-color-text-muted);
    }
    .enterprise-review-summary__facts {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
      gap: var(--mpa-spacing-md);
      margin: 0;
    }
    .enterprise-review-summary__fact dt {
      margin: 0;
      font-size: var(--mpa-font-size-xs);
      color: var(--mpa-color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .enterprise-review-summary__fact dd {
      margin: 0.2rem 0 0;
      font-size: var(--mpa-font-size-sm);
      font-weight: var(--mpa-font-weight-medium);
      word-break: break-word;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseReviewSummaryComponent {
  readonly title = input<string | undefined>('Summary');
  readonly description = input<string | undefined>(undefined);
  readonly facts = input<readonly EnterpriseReviewFact[]>([]);
  readonly previewTitle = input<string | undefined>(undefined);
  readonly previewSubtitle = input<string | undefined>(undefined);
  readonly previewEyebrow = input<string | undefined>(undefined);
  readonly previewIcon = input<string | undefined>(undefined);
  readonly statusLabel = input<string | undefined>(undefined);
  readonly statusSeverity = input<'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'>(
    'secondary',
  );
}
