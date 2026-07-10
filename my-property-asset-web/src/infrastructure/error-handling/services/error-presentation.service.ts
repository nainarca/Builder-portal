import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { APP_ROUTES } from '../../../core/constants/app.constants';
import { NotificationService } from '../../notification/services/notification.service';
import { ClassifiedError, ErrorBannerState, ErrorDialogState } from '../models';

@Injectable({ providedIn: 'root' })
export class GlobalErrorBoundaryService {
  private readonly bannerState = signal<ErrorBannerState | null>(null);
  private readonly dialogState = signal<ErrorDialogState | null>(null);

  readonly banner = this.bannerState.asReadonly();
  readonly dialog = this.dialogState.asReadonly();

  setBanner(state: ErrorBannerState | null): void {
    this.bannerState.set(state);
  }

  setDialog(state: ErrorDialogState | null): void {
    this.dialogState.set(state);
  }

  dismissBanner(): void {
    this.bannerState.set(null);
  }

  dismissDialog(): void {
    this.dialogState.set(null);
  }
}

@Injectable({ providedIn: 'root' })
export class ErrorPresentationService {
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);
  private readonly errorBoundary = inject(GlobalErrorBoundaryService);

  present(error: ClassifiedError): void {
    switch (error.severity) {
      case 'low':
      case 'medium':
        this.presentToast(error);
        return;
      case 'high':
        this.presentBanner(error);
        return;
      case 'critical':
        this.presentCritical(error);
    }
  }

  presentToast(error: ClassifiedError): void {
    if (error.category === 'network') {
      this.notificationService.warning(error.userMessage);
      return;
    }

    this.notificationService.error(error.userMessage, error.technicalMessage);
  }

  presentBanner(error: ClassifiedError): void {
    this.errorBoundary.setBanner({
      title: 'Unable to complete request',
      message: error.userMessage,
      severity: error.severity,
      retryable: error.retryable,
      dismissible: true,
    });
  }

  presentCritical(error: ClassifiedError): void {
    this.errorBoundary.setDialog({
      title: 'Critical error',
      message: error.userMessage,
      technicalDetail: error.technicalMessage,
      retryable: error.retryable,
    });
  }

  navigateToServerError(): void {
    void this.router.navigate([APP_ROUTES.serverError]);
  }

  navigateToMaintenance(): void {
    void this.router.navigate([APP_ROUTES.maintenance]);
  }

  navigateToForbidden(): void {
    void this.router.navigate([APP_ROUTES.forbidden]);
  }
}
