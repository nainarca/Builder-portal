import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-download-placeholder',
  template: `
    <div class="proj-placeholder-panel" role="img" aria-label="Download placeholder">
      <i class="pi pi-download" aria-hidden="true"></i>
      <p>Real file download will be available once storage integration is connected.</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DownloadPlaceholderComponent {}
