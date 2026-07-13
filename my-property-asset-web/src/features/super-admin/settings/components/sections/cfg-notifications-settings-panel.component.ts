import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { FormSectionComponent } from '@shared/ui';

import {
  NotificationChannelSettings,
  NotificationSettings,
} from '../../models/settings-admin.model';
import { SettingsSectionStateService } from '../../services/settings-section-state.service';

interface DigestOption {
  readonly value: NotificationSettings['digestFrequency'];
  readonly label: string;
}

@Component({
  selector: 'app-cfg-notifications-settings-panel',
  imports: [FormSectionComponent],
  template: `
    @if (notifications(); as model) {
      <div class="cfg-panel">
        <app-form-section
          title="Delivery channels"
          description="Choose which channels the platform may use to reach users."
        >
          <div class="cfg-channel-grid">
            <div class="cfg-channel" [class.cfg-channel--on]="model.channels.emailEnabled">
              <span class="cfg-channel__icon" aria-hidden="true"><i class="pi pi-envelope"></i></span>
              <div class="cfg-channel__body">
                <span class="cfg-channel__name">Email</span>
                <span class="cfg-channel__desc">Transactional and digest emails.</span>
              </div>
              <label class="cfg-toggle">
                <input
                  type="checkbox"
                  class="cfg-toggle__input"
                  [checked]="model.channels.emailEnabled"
                  aria-label="Toggle email channel"
                  (change)="patchChannel('emailEnabled', checkedValue($event))"
                />
                <span class="cfg-toggle__track" aria-hidden="true"><span class="cfg-toggle__thumb"></span></span>
              </label>
            </div>

            <div class="cfg-channel" [class.cfg-channel--on]="model.channels.inAppEnabled">
              <span class="cfg-channel__icon" aria-hidden="true"><i class="pi pi-bell"></i></span>
              <div class="cfg-channel__body">
                <span class="cfg-channel__name">In-app</span>
                <span class="cfg-channel__desc">Notification center and toasts.</span>
              </div>
              <label class="cfg-toggle">
                <input
                  type="checkbox"
                  class="cfg-toggle__input"
                  [checked]="model.channels.inAppEnabled"
                  aria-label="Toggle in-app channel"
                  (change)="patchChannel('inAppEnabled', checkedValue($event))"
                />
                <span class="cfg-toggle__track" aria-hidden="true"><span class="cfg-toggle__thumb"></span></span>
              </label>
            </div>

            <div class="cfg-channel cfg-channel--placeholder">
              <span class="cfg-channel__icon" aria-hidden="true"><i class="pi pi-comment"></i></span>
              <div class="cfg-channel__body">
                <span class="cfg-channel__name">
                  SMS <span class="cfg-channel__tag">Coming soon</span>
                </span>
                <span class="cfg-channel__desc">Requires an SMS provider integration.</span>
              </div>
              <label class="cfg-toggle cfg-toggle--disabled">
                <input type="checkbox" class="cfg-toggle__input" [checked]="false" disabled aria-label="SMS channel (coming soon)" />
                <span class="cfg-toggle__track" aria-hidden="true"><span class="cfg-toggle__thumb"></span></span>
              </label>
            </div>

            <div class="cfg-channel cfg-channel--placeholder">
              <span class="cfg-channel__icon" aria-hidden="true"><i class="pi pi-mobile"></i></span>
              <div class="cfg-channel__body">
                <span class="cfg-channel__name">
                  Push <span class="cfg-channel__tag">Coming soon</span>
                </span>
                <span class="cfg-channel__desc">Mobile and web push notifications.</span>
              </div>
              <label class="cfg-toggle cfg-toggle--disabled">
                <input type="checkbox" class="cfg-toggle__input" [checked]="false" disabled aria-label="Push channel (coming soon)" />
                <span class="cfg-toggle__track" aria-hidden="true"><span class="cfg-toggle__thumb"></span></span>
              </label>
            </div>
          </div>
        </app-form-section>

        <app-form-section
          title="Digest frequency"
          description="How often batched notifications are delivered."
        >
          <div class="cfg-field cfg-field--narrow">
            <label class="cfg-field__label" for="cfg-digest">Frequency</label>
            <select
              id="cfg-digest"
              class="cfg-field__input"
              [value]="model.digestFrequency"
              (change)="patchDigest(selectValue($event))"
            >
              @for (option of digestOptions; track option.value) {
                <option [value]="option.value">{{ option.label }}</option>
              }
            </select>
          </div>
        </app-form-section>

        <app-form-section
          title="Templates"
          description="Message templates with preview subjects per channel."
        >
          <div class="cfg-template-list">
            @for (template of model.templates; track template.id) {
              <div class="cfg-template" [class.cfg-template--off]="!template.enabled">
                <div class="cfg-template__info">
                  <div class="cfg-template__name-row">
                    <span class="cfg-template__name">{{ template.name }}</span>
                    <span class="cfg-template__channel">{{ template.channel }}</span>
                  </div>
                  <span class="cfg-template__subject">
                    <i class="pi pi-tag" aria-hidden="true"></i>
                    {{ template.previewSubject }}
                  </span>
                </div>
                <label class="cfg-toggle">
                  <input
                    type="checkbox"
                    class="cfg-toggle__input"
                    [checked]="template.enabled"
                    [attr.aria-label]="'Toggle ' + template.name"
                    (change)="toggleTemplate(template.id, checkedValue($event))"
                  />
                  <span class="cfg-toggle__track" aria-hidden="true"><span class="cfg-toggle__thumb"></span></span>
                </label>
              </div>
            }
          </div>
        </app-form-section>
      </div>
    }
  `,
  styles: `
    .cfg-panel {
      display: flex;
      flex-direction: column;
      gap: 1.75rem;
    }
    .cfg-channel-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
      gap: 0.85rem;
      margin-top: 0.75rem;
    }
    .cfg-channel {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding: 1rem 1.1rem;
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-md, 0.5rem);
      background: var(--mpa-color-surface);
    }
    .cfg-channel--on {
      border-color: color-mix(in srgb, var(--mpa-color-primary) 45%, var(--mpa-color-border));
    }
    .cfg-channel--placeholder {
      opacity: 0.75;
      border-style: dashed;
    }
    .cfg-channel__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.4rem;
      height: 2.4rem;
      flex: none;
      border-radius: var(--mpa-radius-sm, 0.375rem);
      background: color-mix(in srgb, var(--mpa-color-primary) 12%, transparent);
      color: var(--mpa-color-primary);
      font-size: 1.1rem;
    }
    .cfg-channel__body {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
      flex: 1;
      min-width: 0;
    }
    .cfg-channel__name {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      color: var(--mpa-color-text);
    }
    .cfg-channel__tag {
      font-size: var(--mpa-font-size-xs, 0.7rem);
      text-transform: uppercase;
      letter-spacing: 0.03em;
      font-weight: 600;
      color: var(--mpa-color-warning, #d97706);
      background: color-mix(in srgb, var(--mpa-color-warning, #d97706) 14%, transparent);
      padding: 0.1rem 0.45rem;
      border-radius: 999px;
    }
    .cfg-channel__desc {
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text-muted);
    }
    .cfg-field {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      margin-top: 0.75rem;
    }
    .cfg-field--narrow {
      max-width: 20rem;
    }
    .cfg-field__label {
      font-size: var(--mpa-font-size-sm, 0.875rem);
      font-weight: 600;
      color: var(--mpa-color-text);
    }
    .cfg-field__input {
      width: 100%;
      padding: 0.55rem 0.75rem;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text);
      background: var(--mpa-color-surface);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-sm, 0.375rem);
    }
    .cfg-field__input:focus {
      outline: none;
      border-color: var(--mpa-color-primary);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--mpa-color-primary) 18%, transparent);
    }
    .cfg-template-list {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      margin-top: 0.75rem;
    }
    .cfg-template {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.85rem 1.1rem;
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-md, 0.5rem);
      background: var(--mpa-color-surface);
    }
    .cfg-template--off {
      opacity: 0.65;
    }
    .cfg-template__info {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
      min-width: 0;
    }
    .cfg-template__name-row {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }
    .cfg-template__name {
      font-weight: 600;
      color: var(--mpa-color-text);
    }
    .cfg-template__channel {
      font-size: var(--mpa-font-size-xs, 0.75rem);
      text-transform: uppercase;
      letter-spacing: 0.03em;
      color: var(--mpa-color-text-muted);
      background: color-mix(in srgb, var(--mpa-color-text-muted) 12%, transparent);
      padding: 0.1rem 0.5rem;
      border-radius: 999px;
    }
    .cfg-template__subject {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text-muted);
    }
    .cfg-toggle {
      position: relative;
      display: inline-flex;
      flex: none;
      cursor: pointer;
    }
    .cfg-toggle--disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
    .cfg-toggle__input {
      position: absolute;
      opacity: 0;
      width: 100%;
      height: 100%;
      margin: 0;
      cursor: inherit;
    }
    .cfg-toggle__track {
      display: inline-flex;
      align-items: center;
      width: 2.6rem;
      height: 1.5rem;
      padding: 0.15rem;
      border-radius: 999px;
      background: var(--mpa-color-border);
      transition: background 0.15s ease;
    }
    .cfg-toggle__thumb {
      width: 1.2rem;
      height: 1.2rem;
      border-radius: 999px;
      background: #fff;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
      transition: transform 0.15s ease;
    }
    .cfg-toggle__input:checked + .cfg-toggle__track {
      background: var(--mpa-color-primary);
    }
    .cfg-toggle__input:checked + .cfg-toggle__track .cfg-toggle__thumb {
      transform: translateX(1.1rem);
    }
    .cfg-toggle__input:focus-visible + .cfg-toggle__track {
      outline: 2px solid var(--mpa-color-primary);
      outline-offset: 2px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CfgNotificationsSettingsPanelComponent {
  private readonly state = inject(SettingsSectionStateService);

  readonly notifications = computed<NotificationSettings | null>(
    () => this.state.draft()?.notifications ?? null,
  );

  readonly digestOptions: readonly DigestOption[] = [
    { value: 'realtime', label: 'Real-time (as it happens)' },
    { value: 'hourly', label: 'Hourly summary' },
    { value: 'daily', label: 'Daily digest' },
    { value: 'weekly', label: 'Weekly digest' },
  ];

  patchChannel<K extends keyof NotificationChannelSettings>(
    key: K,
    value: NotificationChannelSettings[K],
  ): void {
    const current = this.notifications();
    if (!current) return;
    this.state.patchDraft('notifications', {
      ...current,
      channels: { ...current.channels, [key]: value },
    });
  }

  patchDigest(value: string): void {
    const current = this.notifications();
    if (!current) return;
    this.state.patchDraft('notifications', {
      ...current,
      digestFrequency: value as NotificationSettings['digestFrequency'],
    });
  }

  toggleTemplate(id: string, enabled: boolean): void {
    const current = this.notifications();
    if (!current) return;
    const templates = current.templates.map((template) =>
      template.id === id ? { ...template, enabled } : template,
    );
    this.state.patchDraft('notifications', { ...current, templates });
  }

  selectValue(event: Event): string {
    return (event.target as HTMLSelectElement).value;
  }

  checkedValue(event: Event): boolean {
    return (event.target as HTMLInputElement).checked;
  }
}
