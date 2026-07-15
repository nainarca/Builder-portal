import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-identity-verification-placeholder',
  template: `
    <div class="approval-placeholder-panel" role="img" aria-label="Identity verification placeholder">
      <i class="pi pi-id-card" aria-hidden="true"></i>
      <p>Identity verification will be available here in a future integration.</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdentityVerificationPlaceholderComponent {}
