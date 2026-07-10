import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { ClassifiedError, ErrorCategory, ErrorSeverity } from '../models';

const NETWORK_ERROR_MESSAGE = 'A network error occurred. Check your connection and try again.';
const GENERIC_ERROR_MESSAGE = 'Something went wrong. Please try again.';
const SERVER_ERROR_MESSAGE = 'The server encountered an error. Please try again later.';

@Injectable({ providedIn: 'root' })
export class ErrorClassifierService {
  classify(error: unknown, correlationId?: string): ClassifiedError {
    if (this.isClassifiedError(error)) {
      return error;
    }

    if (error instanceof HttpErrorResponse) {
      return this.classifyHttp(error, correlationId);
    }

    if (error instanceof Error) {
      return {
        category: 'system',
        severity: 'high',
        userMessage: GENERIC_ERROR_MESSAGE,
        technicalMessage: error.message,
        retryable: true,
        correlationId,
        original: error,
      };
    }

    return {
      category: 'unknown',
      severity: 'medium',
      userMessage: GENERIC_ERROR_MESSAGE,
      technicalMessage: String(error),
      retryable: false,
      correlationId,
      original: error,
    };
  }

  classifyHttp(error: HttpErrorResponse, correlationId?: string): ClassifiedError {
    const status = error.status;

    if (status === 0) {
      return this.build('network', 'medium', NETWORK_ERROR_MESSAGE, error, true, correlationId);
    }

    if (status === 401 || status === 403) {
      return this.build(
        'authorization',
        'high',
        status === 401 ? 'Your session may have expired.' : 'You do not have permission for this action.',
        error,
        false,
        correlationId,
      );
    }

    if (status === 404) {
      return this.build('data', 'medium', 'The requested resource was not found.', error, false, correlationId);
    }

    if (status === 422) {
      return this.build('validation', 'medium', 'Please review the entered information.', error, false, correlationId);
    }

    if (status >= 500) {
      return this.build('system', 'high', SERVER_ERROR_MESSAGE, error, true, correlationId);
    }

    return this.build('unknown', 'medium', GENERIC_ERROR_MESSAGE, error, true, correlationId);
  }

  private build(
    category: ErrorCategory,
    severity: ErrorSeverity,
    userMessage: string,
    original: unknown,
    retryable: boolean,
    correlationId?: string,
  ): ClassifiedError {
    const technicalMessage =
      original instanceof HttpErrorResponse
        ? original.message || `HTTP ${original.status}`
        : original instanceof Error
          ? original.message
          : undefined;

    return {
      category,
      severity,
      userMessage,
      technicalMessage,
      retryable,
      correlationId,
      original,
    };
  }

  private isClassifiedError(error: unknown): error is ClassifiedError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'category' in error &&
      'severity' in error &&
      'userMessage' in error
    );
  }
}
