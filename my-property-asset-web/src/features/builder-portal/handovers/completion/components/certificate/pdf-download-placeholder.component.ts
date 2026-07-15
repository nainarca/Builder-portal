import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-pdf-download-placeholder',
  template: `
    <div class="completion-placeholder-panel" role="img" aria-label="PDF download placeholder">
      <i class="pi pi-file-pdf" aria-hidden="true"></i>
      <p>Downloading this certificate as a PDF will be available in a future integration.</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PdfDownloadPlaceholderComponent {}
