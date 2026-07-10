export interface MaintenanceState {
  enabled: boolean;
  title: string;
  message: string;
  estimatedReturn?: string;
}

export interface SystemAnnouncement {
  id: string;
  title: string;
  message: string;
  level: 'info' | 'warning' | 'critical';
  dismissible: boolean;
}
