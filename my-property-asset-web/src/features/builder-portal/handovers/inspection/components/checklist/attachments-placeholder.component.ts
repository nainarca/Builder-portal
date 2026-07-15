import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-attachments-placeholder',
  template: `
    <div class="insp-placeholder-panel" role="img" aria-label="Attachments placeholder">
      <i class="pi pi-paperclip" aria-hidden="true"></i>
      <p>Photo and document attachments will appear here in a future module.</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttachmentsPlaceholderComponent {}
