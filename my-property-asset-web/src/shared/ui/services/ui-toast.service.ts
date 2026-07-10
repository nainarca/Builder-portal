import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

import { FeedbackSeverity } from '../models';

export interface ToastMessage {
  summary: string;
  detail?: string;
  severity?: FeedbackSeverity;
  life?: number;
}

@Injectable({ providedIn: 'root' })
export class UiToastService {
  private readonly messageService = inject(MessageService);

  show(message: ToastMessage): void {
    this.messageService.add({
      severity: message.severity ?? 'info',
      summary: message.summary,
      detail: message.detail,
      life: message.life ?? 4000,
    });
  }

  success(summary: string, detail?: string): void {
    this.show({ summary, detail, severity: 'success' });
  }

  info(summary: string, detail?: string): void {
    this.show({ summary, detail, severity: 'info' });
  }

  warn(summary: string, detail?: string): void {
    this.show({ summary, detail, severity: 'warn' });
  }

  error(summary: string, detail?: string): void {
    this.show({ summary, detail, severity: 'error' });
  }

  clear(): void {
    this.messageService.clear();
  }
}
