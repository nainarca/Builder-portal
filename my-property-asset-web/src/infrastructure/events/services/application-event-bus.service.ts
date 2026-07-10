import { Injectable, signal } from '@angular/core';

import {
  ApplicationEvent,
  ApplicationEventType,
  EventUnsubscribe,
} from '../models/application-events.model';

type EventHandler = (event: ApplicationEvent) => void;

@Injectable({ providedIn: 'root' })
export class ApplicationEventBusService {
  private readonly listeners = new Map<ApplicationEventType | '*', Set<EventHandler>>();
  private readonly lastEvent = signal<ApplicationEvent | null>(null);

  readonly latestEvent = this.lastEvent.asReadonly();

  publish<T>(event: ApplicationEvent<T>): void {
    this.lastEvent.set(event);
    this.listeners.get(event.type)?.forEach((handler) => handler(event));
    this.listeners.get('*')?.forEach((handler) => handler(event));
  }

  on<T>(type: ApplicationEventType, handler: (event: ApplicationEvent<T>) => void): EventUnsubscribe {
    const wrapped: EventHandler = (event) => handler(event as ApplicationEvent<T>);
    this.addListener(type, wrapped);

    return () => {
      this.listeners.get(type)?.delete(wrapped);
    };
  }

  onAny(handler: (event: ApplicationEvent) => void): EventUnsubscribe {
    this.addListener('*', handler);
    return () => this.listeners.get('*')?.delete(handler);
  }

  private addListener(type: ApplicationEventType | '*', handler: EventHandler): void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }

    this.listeners.get(type)?.add(handler);
  }
}
