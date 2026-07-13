import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { SettingsAdminStoreService } from '../../services/settings-admin-store.service';
import { SettingsNavigationStateService } from '../../services/settings-navigation-state.service';

@Component({
  selector: 'app-cfg-settings-overview',
  template: `
    <section class="cfg-overview" aria-label="Settings overview">
      <article class="cfg-overview__health">
        <div
          class="cfg-overview__ring"
          [style.background]="ringStyle()"
          role="img"
          [attr.aria-label]="score() + ' percent platform health'"
        >
          <span class="cfg-overview__ring-inner">
            <span class="cfg-overview__score">{{ score() }}</span>
            <span class="cfg-overview__score-unit">/ 100</span>
          </span>
        </div>
        <div class="cfg-overview__health-body">
          <span class="cfg-overview__eyebrow">Platform health</span>
          <span class="cfg-overview__status" [style.color]="statusColor()">{{ statusLabel() }}</span>
          <span class="cfg-overview__hint">Composite score across security, platform, and configuration state.</span>
        </div>
      </article>

      <article class="cfg-overview__environment">
        <header class="cfg-overview__env-header">
          <span class="cfg-overview__eyebrow">Environment</span>
          <span class="cfg-overview__env-badge" [class.cfg-overview__env-badge--live]="environment().runtimeLoaded">
            {{ environment().runtimeLoaded ? 'Runtime loaded' : 'Static config' }}
          </span>
        </header>
        <dl class="cfg-overview__env-grid">
          <div class="cfg-overview__env-item">
            <dt>Name</dt>
            <dd>{{ environment().name }}</dd>
          </div>
          <div class="cfg-overview__env-item">
            <dt>Version</dt>
            <dd>{{ environment().version }}</dd>
          </div>
          <div class="cfg-overview__env-item cfg-overview__env-item--wide">
            <dt>API base URL</dt>
            <dd class="cfg-overview__mono">{{ environment().apiBaseUrl }}</dd>
          </div>
        </dl>
      </article>
    </section>
  `,
  styles: `
    .cfg-overview {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);
      gap: 1.25rem;
    }
    @media (max-width: 768px) {
      .cfg-overview { grid-template-columns: 1fr; }
    }
    .cfg-overview__health,
    .cfg-overview__environment {
      padding: 1.5rem;
      background: var(--mpa-color-surface);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-lg, 0.75rem);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    }
    .cfg-overview__health {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    .cfg-overview__ring {
      position: relative;
      width: 6.5rem;
      height: 6.5rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex: none;
    }
    .cfg-overview__ring::before {
      content: '';
      position: absolute;
      inset: 0.7rem;
      border-radius: 50%;
      background: var(--mpa-color-surface);
    }
    .cfg-overview__ring-inner {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      line-height: 1;
    }
    .cfg-overview__score {
      font-size: 1.85rem;
      font-weight: 700;
      color: var(--mpa-color-text);
    }
    .cfg-overview__score-unit {
      font-size: var(--mpa-font-size-xs, 0.75rem);
      color: var(--mpa-color-text-muted);
      margin-top: 0.2rem;
    }
    .cfg-overview__health-body {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      min-width: 0;
    }
    .cfg-overview__eyebrow {
      font-size: var(--mpa-font-size-xs, 0.75rem);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--mpa-color-text-muted);
    }
    .cfg-overview__status {
      font-size: 1.15rem;
      font-weight: 700;
    }
    .cfg-overview__hint {
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text-muted);
    }
    .cfg-overview__env-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      margin-bottom: 1.1rem;
    }
    .cfg-overview__env-badge {
      font-size: var(--mpa-font-size-xs, 0.75rem);
      font-weight: 600;
      padding: 0.2rem 0.65rem;
      border-radius: 999px;
      color: var(--mpa-color-text-muted);
      border: 1px solid var(--mpa-color-border);
    }
    .cfg-overview__env-badge--live {
      color: var(--mpa-color-success);
      border-color: var(--mpa-color-success);
      background: color-mix(in srgb, var(--mpa-color-success) 10%, transparent);
    }
    .cfg-overview__env-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.85rem 1.25rem;
      margin: 0;
    }
    .cfg-overview__env-item { display: flex; flex-direction: column; gap: 0.2rem; min-width: 0; }
    .cfg-overview__env-item--wide { grid-column: 1 / -1; }
    .cfg-overview__env-item dt {
      font-size: var(--mpa-font-size-xs, 0.75rem);
      color: var(--mpa-color-text-muted);
    }
    .cfg-overview__env-item dd {
      margin: 0;
      font-weight: 600;
      color: var(--mpa-color-text);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .cfg-overview__mono {
      font-family: var(--mpa-font-family-mono, ui-monospace, monospace);
      font-size: var(--mpa-font-size-sm, 0.875rem);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CfgSettingsOverviewComponent {
  private readonly store = inject(SettingsAdminStoreService);
  private readonly navState = inject(SettingsNavigationStateService);

  readonly score = this.store.healthScore;
  readonly environment = this.navState.environmentSummary;

  readonly statusColor = computed(() => {
    const value = this.score();
    if (value >= 85) return 'var(--mpa-color-success)';
    if (value >= 60) return 'var(--mpa-color-warning)';
    return 'var(--mpa-color-danger)';
  });

  readonly statusLabel = computed(() => {
    const value = this.score();
    if (value >= 85) return 'Healthy';
    if (value >= 60) return 'Needs attention';
    return 'At risk';
  });

  readonly ringStyle = computed(
    () => `conic-gradient(${this.statusColor()} ${this.score() * 3.6}deg, var(--mpa-color-border) 0deg)`,
  );
}
