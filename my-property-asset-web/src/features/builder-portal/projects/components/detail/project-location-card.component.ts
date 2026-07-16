import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ContentCardComponent } from '@shared/ui';

import { ProjectLocation } from '../../models/project.model';

@Component({
  selector: 'app-proj-location-card',
  imports: [ContentCardComponent],
  template: `
    <app-content-card icon="map-marker">
      <h3 class="mpa-heading-sm m-0">Location</h3>
      <p class="mpa-body-md m-0">{{ location().addressLine || '—' }}</p>
      <p class="mpa-body-md m-0">
        {{ location().city }}, {{ location().state }} {{ location().postalCode }}
      </p>
      @if (location().latitude != null && location().longitude != null) {
        <p class="mpa-body-md m-0">
          {{ location().latitude }}, {{ location().longitude }}
        </p>
      }
    </app-content-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectLocationCardComponent {
  readonly location = input.required<ProjectLocation>();
}
