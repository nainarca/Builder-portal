import { Injectable } from '@angular/core';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
  correlationId?: string;
  [key: string]: unknown;
}

@Injectable({ providedIn: 'root' })
export class LoggerService {
  debug(message: string, context?: LogContext): void {
    this.write('debug', message, context);
  }

  info(message: string, context?: LogContext): void {
    this.write('info', message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.write('warn', message, context);
  }

  error(message: string, context?: LogContext): void {
    this.write('error', message, context);
  }

  createCorrelationId(): string {
    return `mpa-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }

  private write(level: LogLevel, message: string, context?: LogContext): void {
    const payload = {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...context,
    };

    switch (level) {
      case 'debug':
        console.debug('[MPA]', payload);
        break;
      case 'info':
        console.info('[MPA]', payload);
        break;
      case 'warn':
        console.warn('[MPA]', payload);
        break;
      case 'error':
        console.error('[MPA]', payload);
        break;
    }
  }
}
