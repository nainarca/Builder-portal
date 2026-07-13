import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { ButtonComponent, FormSectionComponent } from '@shared/ui';

import { IntegrationSetting, IntegrationStatus } from '../../models/settings-admin.model';
import { SettingsSectionStateService } from '../../services/settings-section-state.service';
import { CfgStatusIndicatorComponent } from '../shared/cfg-status-indicator.component';

const CATEGORY_ICONS: Record<IntegrationSetting['category'], string> = {
  api: 'pi pi-code',
  payment: 'pi pi-credit-card',
  email: 'pi pi-envelope',
  sms: 'pi pi-comment',
  storage: 'pi pi-database',
};

@Component({
  selector: 'app-cfg-integrations-settings-panel',
  imports: [FormSectionComponent, ButtonComponent, CfgStatusIndicatorComponent],
  template: `
    <div class="cfg-panel">
      <app-form-section
        title="Active integrations"
        description="Connected and available service providers."
      >
        <div class="cfg-integration-grid">
          @for (integration of activeIntegrations(); track integration.id) {
            <article class="cfg-integration-card">
              <header class="cfg-integration-card__head">
                <span class="cfg-integration-card__icon" aria-hidden="true">
                  <i [class]="iconFor(integration.category)"></i>
                </span>
                <div class="cfg-integration-card__title">
                  <span class="cfg-integration-card__name">{{ integration.name }}</span>
                  <span class="cfg-integration-card__category">{{ integration.category }}</span>
                </div>
              </header>
              <p class="cfg-integration-card__desc">{{ integration.description }}</p>
              <footer class="cfg-integration-card__footer">
                <app-cfg-status-indicator [status]="integration.status" />
                <app-button
                  [label]="integration.status === 'connected' ? 'Disconnect' : 'Connect'"
                  [severity]="integration.status === 'connected' ? 'secondary' : 'primary'"
                  [outlined]="integration.status === 'connected'"
                  size="small"
                  (clicked)="toggleConnection(integration)"
                />
              </footer>
            </article>
          }
        </div>
      </app-form-section>

      <app-form-section
        title="Planned integrations"
        description="Providers on the roadmap and not yet available for connection."
      >
        <div class="cfg-integration-grid">
          @for (integration of plannedIntegrations(); track integration.id) {
            <article class="cfg-integration-card cfg-integration-card--planned">
              <header class="cfg-integration-card__head">
                <span class="cfg-integration-card__icon" aria-hidden="true">
                  <i [class]="iconFor(integration.category)"></i>
                </span>
                <div class="cfg-integration-card__title">
                  <span class="cfg-integration-card__name">{{ integration.name }}</span>
                  <span class="cfg-integration-card__category">{{ integration.category }}</span>
                </div>
                <span class="cfg-planned-badge">
                  <i class="pi pi-clock" aria-hidden="true"></i> Planned
                </span>
              </header>
              <p class="cfg-integration-card__desc">{{ integration.description }}</p>
              <footer class="cfg-integration-card__footer">
                <app-cfg-status-indicator [status]="integration.status" />
              </footer>
            </article>
          }
        </div>
      </app-form-section>
    </div>
  `,
  styles: `
    .cfg-panel {
      display: flex;
      flex-direction: column;
      gap: 1.75rem;
    }
    .cfg-integration-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(17rem, 1fr));
      gap: 1rem;
      margin-top: 0.75rem;
    }
    .cfg-integration-card {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding: 1.1rem 1.15rem;
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-md, 0.5rem);
      background: var(--mpa-color-surface);
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }
    .cfg-integration-card:hover {
      border-color: color-mix(in srgb, var(--mpa-color-primary) 40%, var(--mpa-color-border));
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    }
    .cfg-integration-card--planned {
      border-style: dashed;
    }
    .cfg-integration-card--planned:hover {
      box-shadow: none;
    }
    .cfg-integration-card__head {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .cfg-integration-card__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      flex: none;
      border-radius: var(--mpa-radius-sm, 0.375rem);
      background: color-mix(in srgb, var(--mpa-color-primary) 12%, transparent);
      color: var(--mpa-color-primary);
      font-size: 1.15rem;
    }
    .cfg-integration-card__title {
      display: flex;
      flex-direction: column;
      gap: 0.1rem;
      flex: 1;
      min-width: 0;
    }
    .cfg-integration-card__name {
      font-weight: 600;
      color: var(--mpa-color-text);
    }
    .cfg-integration-card__category {
      font-size: var(--mpa-font-size-xs, 0.75rem);
      text-transform: uppercase;
      letter-spacing: 0.03em;
      color: var(--mpa-color-text-muted);
    }
    .cfg-planned-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      flex: none;
      padding: 0.15rem 0.55rem;
      border-radius: 999px;
      font-size: var(--mpa-font-size-xs, 0.7rem);
      font-weight: 600;
      color: var(--mpa-color-warning, #d97706);
      background: color-mix(in srgb, var(--mpa-color-warning, #d97706) 14%, transparent);
    }
    .cfg-integration-card__desc {
      margin: 0;
      flex: 1;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text-muted);
    }
    .cfg-integration-card__footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      padding-top: 0.35rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CfgIntegrationsSettingsPanelComponent {
  private readonly state = inject(SettingsSectionStateService);

  readonly integrations = computed<IntegrationSetting[]>(() => this.state.draft()?.integrations ?? []);

  readonly activeIntegrations = computed<IntegrationSetting[]>(() =>
    this.integrations().filter((integration) => !integration.planned),
  );

  readonly plannedIntegrations = computed<IntegrationSetting[]>(() =>
    this.integrations().filter((integration) => integration.planned),
  );

  iconFor(category: IntegrationSetting['category']): string {
    return CATEGORY_ICONS[category];
  }

  toggleConnection(integration: IntegrationSetting): void {
    if (integration.planned) return;
    const nextStatus: IntegrationStatus =
      integration.status === 'connected' ? 'disconnected' : 'connected';
    const updated: IntegrationSetting[] = this.integrations().map((item) =>
      item.id === integration.id ? { ...item, status: nextStatus } : item,
    );
    this.state.patchDraft('integrations', updated);
  }
}
