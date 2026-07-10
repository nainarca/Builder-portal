import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { LoggerService } from '../../logging/services/logger.service';
import { ErrorClassifierService } from '../services/error-classifier.service';
import { ErrorPresentationService } from '../services/error-presentation.service';

export const httpErrorInterceptor: HttpInterceptorFn = (request, next) => {
  const classifier = inject(ErrorClassifierService);
  const presentation = inject(ErrorPresentationService);
  const logger = inject(LoggerService);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      const correlationId = logger.createCorrelationId();
      const classified = classifier.classifyHttp(error, correlationId);

      logger.error('HTTP request failed', {
        correlationId,
        url: request.url,
        method: request.method,
        status: error.status,
        category: classified.category,
        severity: classified.severity,
      });

      if (classified.severity !== 'low') {
        presentation.present(classified);
      }

      return throwError(() => classified);
    }),
  );
};
