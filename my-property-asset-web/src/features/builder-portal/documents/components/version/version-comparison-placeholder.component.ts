import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-version-comparison-placeholder',
  template: `
    <div class="proj-placeholder-panel" role="img" aria-label="Version comparison placeholder">
      <i class="pi pi-sliders-h" aria-hidden="true"></i>
      <p>Side-by-side version comparison will be available in a future module.</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VersionComparisonPlaceholderComponent {}
