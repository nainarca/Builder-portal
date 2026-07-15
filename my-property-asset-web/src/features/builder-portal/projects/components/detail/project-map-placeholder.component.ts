import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-proj-map-placeholder',
  template: `
    <div class="proj-placeholder-panel" role="img" aria-label="Map placeholder">
      <i class="pi pi-map" aria-hidden="true"></i>
      <p>Map view coming in a future module.</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectMapPlaceholderComponent {}
