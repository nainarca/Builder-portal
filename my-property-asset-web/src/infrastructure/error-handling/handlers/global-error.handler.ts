import { ErrorHandler, Injectable, inject } from '@angular/core';

import { LoggerService } from '../../logging/services/logger.service';
import { ErrorClassifierService } from '../services/error-classifier.service';
import { ErrorPresentationService } from '../services/error-presentation.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly classifier = inject(ErrorClassifierService);
  private readonly presentation = inject(ErrorPresentationService);
  private readonly logger = inject(LoggerService);

  handleError(error: unknown): void {
    const correlationId = this.logger.createCorrelationId();
    const classified = this.classifier.classify(error, correlationId);

    this.logger.error('Unhandled application error', {
      correlationId,
      category: classified.category,
      severity: classified.severity,
      technicalMessage: classified.technicalMessage,
    });

    this.presentation.present(classified);
  }
}
