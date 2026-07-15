import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-otp-verification-placeholder',
  template: `
    <div class="approval-placeholder-panel" role="img" aria-label="OTP verification placeholder">
      <i class="pi pi-shield" aria-hidden="true"></i>
      <p>OTP verification will be available here in a future integration.</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtpVerificationPlaceholderComponent {}
