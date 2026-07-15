import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-owner-document-placeholder',
  template: `
    <div class="proj-placeholder-panel" role="img" aria-label="Documents placeholder">
      <i class="pi pi-file" aria-hidden="true"></i>
      <p>Owner documents will appear here in a future module.</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerDocumentPlaceholderComponent {}
