import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-owner-handover-placeholder',
  template: `
    <div class="proj-placeholder-panel" role="img" aria-label="Digital handover placeholder">
      <i class="pi pi-key" aria-hidden="true"></i>
      <p>Digital handover workflow will appear here in a future module.</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerHandoverPlaceholderComponent {}
