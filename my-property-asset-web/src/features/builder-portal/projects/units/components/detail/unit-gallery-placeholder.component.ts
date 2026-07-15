import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-unit-gallery-placeholder',
  template: `
    <div class="proj-placeholder-panel" role="img" aria-label="Gallery placeholder">
      <i class="pi pi-images" aria-hidden="true"></i>
      <p>Unit photo gallery coming in a future module.</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnitGalleryPlaceholderComponent {}
