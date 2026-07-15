import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-qr-verification-placeholder',
  template: `
    <div class="completion-placeholder-panel" role="img" aria-label="QR verification placeholder">
      <i class="pi pi-qrcode" aria-hidden="true"></i>
      <p>A scannable QR verification code will appear here in a future integration.</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrVerificationPlaceholderComponent {}
