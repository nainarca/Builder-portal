import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { InputTextComponent } from '@shared/ui';

import { BrandStudioStateService } from '../../services/brand-studio-state.service';

@Component({
  selector: 'app-wl-identity-panel',
  imports: [InputTextComponent],
  template: `
    @if (studio.draftModel(); as model) {
      <section class="wl-identity-panel" aria-label="Brand identity">
        <div class="wl-identity-panel__field">
          <label class="wl-identity-panel__label" for="wl-identity-app-name">Application name</label>
          <app-input-text
            inputId="wl-identity-app-name"
            [value]="model.identity.applicationName"
            placeholder="MyPropertyAsset"
            (valueChange)="studio.patchIdentity({ applicationName: $event })"
          />
        </div>

        <div class="wl-identity-panel__field">
          <label class="wl-identity-panel__label" for="wl-identity-short-name">Short name</label>
          <app-input-text
            inputId="wl-identity-short-name"
            [value]="model.identity.shortName"
            placeholder="MPA"
            (valueChange)="studio.patchIdentity({ shortName: $event })"
          />
        </div>

        <div class="wl-identity-panel__field">
          <label class="wl-identity-panel__label" for="wl-identity-company">Company name</label>
          <app-input-text
            inputId="wl-identity-company"
            [value]="model.identity.companyName"
            placeholder="MyPropertyAsset Inc."
            (valueChange)="studio.patchIdentity({ companyName: $event })"
          />
        </div>

        <div class="wl-identity-panel__field">
          <label class="wl-identity-panel__label" for="wl-identity-tagline">Tagline</label>
          <app-input-text
            inputId="wl-identity-tagline"
            [value]="model.identity.tagline"
            placeholder="Enterprise property asset management"
            (valueChange)="studio.patchIdentity({ tagline: $event })"
          />
        </div>

        <div class="wl-identity-panel__field wl-identity-panel__field--wide">
          <label class="wl-identity-panel__label" for="wl-identity-description">Description</label>
          <app-input-text
            inputId="wl-identity-description"
            [value]="model.identity.description"
            placeholder="Short summary shown across brand surfaces"
            (valueChange)="studio.patchIdentity({ description: $event })"
          />
        </div>
      </section>
    }
  `,
  styles: `
    .wl-identity-panel {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1rem;
    }
    .wl-identity-panel__field { display: flex; flex-direction: column; gap: 0.35rem; }
    .wl-identity-panel__field--wide { grid-column: 1 / -1; }
    .wl-identity-panel__label {
      font-size: var(--mpa-font-size-sm, 0.875rem);
      font-weight: 500;
      color: var(--mpa-color-text);
    }
    @media (max-width: 640px) {
      .wl-identity-panel { grid-template-columns: 1fr; }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WlIdentityPanelComponent {
  readonly studio = inject(BrandStudioStateService);
}
