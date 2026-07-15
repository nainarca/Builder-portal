import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FUTURE_INTEGRATION_POINTS } from '../../config/completion.config';

@Component({
  selector: 'app-future-integrations-panel',
  template: `
    <div class="handover-info-panel">
      <h3 class="handover-info-panel__title">Future integrations</h3>
      <p class="mpa-body-md">This workflow is designed so each of the following can be plugged in later without changing the architecture.</p>
      <div class="future-integrations-grid">
        @for (point of points; track point.id) {
          <div class="future-integrations-grid__item">
            <span class="future-integrations-grid__icon"><i [class]="point.icon" aria-hidden="true"></i></span>
            <div>
              <p class="future-integrations-grid__label">{{ point.label }}</p>
              <p class="future-integrations-grid__description">{{ point.description }}</p>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FutureIntegrationsPanelComponent {
  readonly points = FUTURE_INTEGRATION_POINTS;
}
