import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import type { EnterpriseUserProfileData } from './models/enterprise-workspace.models';

/** User profile card — avatar, account info, preference placeholders (presentation). */
@Component({
  selector: 'app-enterprise-user-profile-card',
  template: `
    <article
      class="enterprise-user-profile-card"
      [class.enterprise-user-profile-card--compact]="compact()"
      [attr.aria-label]="ariaLabel()"
    >
      <div class="enterprise-user-profile-card__identity">
        @if (avatarUrl()) {
          <img
            class="enterprise-user-profile-card__avatar enterprise-user-profile-card__avatar--image"
            [src]="avatarUrl()!"
            alt=""
          />
        } @else {
          <span class="enterprise-user-profile-card__avatar" aria-hidden="true">{{ initials() }}</span>
        }
        @if (!compact()) {
          <div class="enterprise-user-profile-card__text">
            @if (displayName()) {
              <p class="enterprise-user-profile-card__name">{{ displayName() }}</p>
            }
            <p class="enterprise-user-profile-card__email">{{ email() }}</p>
            @if (organizationName()) {
              <p class="enterprise-user-profile-card__org">{{ organizationName() }}</p>
            }
            @if (roleLabel()) {
              <p class="enterprise-user-profile-card__meta">{{ roleLabel() }}</p>
            }
          </div>
        }
      </div>

      @if (!compact() && showPreferences()) {
        <ul class="enterprise-user-profile-card__prefs" aria-label="Preferences">
          <li>
            <span class="enterprise-user-profile-card__pref-label">Language</span>
            <span>{{ languageLabel() }}</span>
          </li>
          <li>
            <span class="enterprise-user-profile-card__pref-label">Timezone</span>
            <span>{{ timezoneLabel() }}</span>
          </li>
          @if (sessionLabel()) {
            <li>
              <span class="enterprise-user-profile-card__pref-label">Session</span>
              <span>{{ sessionLabel() }}</span>
            </li>
          }
        </ul>
      }

      <div class="enterprise-user-profile-card__actions">
        <ng-content select="[profileActions]" />
      </div>
    </article>
  `,
  styles: `
    .enterprise-user-profile-card {
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-md);
      padding: var(--mpa-spacing-md);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-lg);
      background: var(--mpa-color-surface);
    }
    .enterprise-user-profile-card--compact {
      padding: 0;
      border: 0;
      background: transparent;
    }
    .enterprise-user-profile-card__identity {
      display: flex;
      align-items: center;
      gap: var(--mpa-spacing-sm);
      min-width: 0;
    }
    .enterprise-user-profile-card__avatar {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--mpa-avatar-size-md);
      height: var(--mpa-avatar-size-md);
      border-radius: 999px;
      background: var(--mpa-color-primary-subtle, var(--mpa-color-surface-muted));
      color: var(--mpa-color-primary);
      font-size: var(--mpa-font-size-sm);
      font-weight: var(--mpa-font-weight-semibold);
      flex-shrink: 0;
      object-fit: cover;
    }
    .enterprise-user-profile-card__avatar--image {
      padding: 0;
    }
    .enterprise-user-profile-card__text {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 0.1rem;
    }
    .enterprise-user-profile-card__name,
    .enterprise-user-profile-card__email,
    .enterprise-user-profile-card__org,
    .enterprise-user-profile-card__meta {
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .enterprise-user-profile-card__name {
      font-size: var(--mpa-font-size-sm);
      font-weight: var(--mpa-font-weight-semibold);
    }
    .enterprise-user-profile-card__email {
      font-size: var(--mpa-font-size-xs);
      color: var(--mpa-color-text);
    }
    .enterprise-user-profile-card__org,
    .enterprise-user-profile-card__meta {
      font-size: var(--mpa-font-size-xs);
      color: var(--mpa-color-text-muted);
    }
    .enterprise-user-profile-card__prefs {
      list-style: none;
      margin: 0;
      padding: var(--mpa-spacing-sm) 0 0;
      border-top: 1px solid var(--mpa-color-border);
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-xs);
    }
    .enterprise-user-profile-card__prefs li {
      display: flex;
      justify-content: space-between;
      gap: var(--mpa-spacing-sm);
      font-size: var(--mpa-font-size-xs);
      color: var(--mpa-color-text-muted);
    }
    .enterprise-user-profile-card__pref-label {
      font-weight: var(--mpa-font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .enterprise-user-profile-card__actions:empty {
      display: none;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseUserProfileCardComponent {
  readonly email = input.required<string>();
  readonly displayName = input<string | undefined>(undefined);
  readonly organizationName = input<string | undefined>(undefined);
  readonly avatarUrl = input<string | null | undefined>(undefined);
  readonly roleLabel = input<string | undefined>(undefined);
  readonly sessionLabel = input<string | undefined>(undefined);
  readonly languageLabel = input('English (placeholder)');
  readonly timezoneLabel = input('Browser default (placeholder)');
  readonly compact = input(false);
  readonly showPreferences = input(false);
  readonly ariaLabel = input('User profile');

  readonly initials = computed(() => {
    const name = this.displayName()?.trim();
    if (name) {
      const parts = name.split(/\s+/).filter(Boolean);
      return parts
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase() ?? '')
        .join('');
    }
    return this.email().charAt(0).toUpperCase() || '?';
  });
}

/** Optional factory helper for hosts mapping auth context → card inputs. */
export function toUserProfileCardData(
  data: EnterpriseUserProfileData,
): EnterpriseUserProfileData {
  return data;
}
