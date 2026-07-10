import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';

import { SESSION_CONFIG } from '../config/session.config';
import {
  SessionSyncMessage,
  SessionSyncMessageType,
} from '../models/session-lifecycle.model';

type SyncHandler = (message: SessionSyncMessage) => void;

@Injectable({ providedIn: 'root' })
export class SessionSyncService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly tabId = crypto.randomUUID();

  private channel: BroadcastChannel | null = null;
  private handler: SyncHandler | null = null;

  initialize(handler: SyncHandler): void {
    if (typeof window === 'undefined' || this.channel) {
      return;
    }

    this.handler = handler;
    this.channel = new BroadcastChannel(SESSION_CONFIG.syncChannelName);
    this.channel.onmessage = (event: MessageEvent<SessionSyncMessage>) => {
      const message = event.data;
      if (!message || message.tabId === this.tabId) {
        return;
      }

      this.handler?.(message);
    };

    fromEvent<StorageEvent>(window, 'storage')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => this.handleStorageEvent(event));
  }

  broadcast(type: SessionSyncMessageType, payload?: unknown): void {
    this.channel?.postMessage({
      type,
      tabId: this.tabId,
      timestamp: Date.now(),
      payload,
    } satisfies SessionSyncMessage);
  }

  destroy(): void {
    this.channel?.close();
    this.channel = null;
    this.handler = null;
  }

  private handleStorageEvent(event: StorageEvent): void {
    if (!event.key || !event.key.includes('auth-token')) {
      return;
    }

    if (event.newValue === null) {
      this.handler?.({
        type: 'LOGOUT',
        tabId: 'storage',
        timestamp: Date.now(),
      });
      return;
    }

    this.handler?.({
      type: 'SESSION_REFRESHED',
      tabId: 'storage',
      timestamp: Date.now(),
    });
  }
}
