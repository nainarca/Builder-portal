import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { GlobalErrorBoundaryService } from '../../../error-handling';
import { ButtonComponent } from '../../../../shared/ui';

@Component({
  selector: 'app-error-banner',
  imports: [ButtonComponent],
  template: `
    @if (banner(); as state) {
      <div
        class="platform-banner platform-banner--error"
        role="alert"
        aria-live="assertive"
      >
        <div class="platform-banner__content">
          <strong class="platform-banner__title">{{ state.title }}</strong>
          <span class="platform-banner__message">{{ state.message }}</span>
        </div>
        <div class="platform-banner__actions">
          @if (state.retryable) {
            <app-button label="Retry" size="small" [text]="true" (clicked)="retry()" />
          }
          @if (state.dismissible) {
            <app-button
              icon="pi pi-times"
              size="small"
              [text]="true"
              ariaLabel="Dismiss error"
              (clicked)="dismiss()"
            />
          }
        </div>
      </div>
    }
  `,
  styleUrl: '../../styles/_platform-shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorBannerComponent {
  private readonly errorBoundary = inject(GlobalErrorBoundaryService);

  readonly banner = this.errorBoundary.banner;

  dismiss(): void {
    this.errorBoundary.dismissBanner();
  }

  retry(): void {
    this.errorBoundary.dismissBanner();
    window.location.reload();
  }
}
