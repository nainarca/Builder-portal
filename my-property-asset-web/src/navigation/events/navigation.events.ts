import { NavigationItem } from '../models';

export interface NavigationEventPayload {
  item: NavigationItem;
  zone: string;
  context: string;
  timestamp: number;
}

export type NavigationEventType = 'navigate' | 'contextChanged' | 'zoneToggled';

export interface NavigationContextChangedPayload {
  context: string;
  refreshed?: boolean;
}

export interface NavigationEvent {
  type: NavigationEventType;
  payload:
    | NavigationEventPayload
    | NavigationContextChangedPayload
    | { zone: string; open: boolean };
}
