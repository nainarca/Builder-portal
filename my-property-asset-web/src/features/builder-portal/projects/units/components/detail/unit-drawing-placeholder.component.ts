import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-unit-drawing-placeholder',
  template: `
    <div class="proj-placeholder-panel" role="img" aria-label="Drawing placeholder">
      <i class="pi pi-file-pdf" aria-hidden="true"></i>
      <p>Floor plan and architectural drawings coming in a future module.</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnitDrawingPlaceholderComponent {}
