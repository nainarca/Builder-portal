import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-preview-placeholder',
  template: `
    <div class="proj-placeholder-panel" role="img" aria-label="Preview placeholder">
      <i class="pi pi-eye" aria-hidden="true"></i>
      <p>Document preview will appear here in a future module.</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewPlaceholderComponent {}
