import { Injectable } from '@angular/core';

import { SUPER_ADMIN_DASHBOARD_WIDGETS } from '../config/super-admin-dashboard.config';
import { DashboardWidgetDefinition, DashboardWidgetId } from '../models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class WidgetRegistryService {
  private readonly registry = new Map<DashboardWidgetId, DashboardWidgetDefinition>(
    SUPER_ADMIN_DASHBOARD_WIDGETS.map((widget) => [widget.id, widget]),
  );

  getAll(): readonly DashboardWidgetDefinition[] {
    return [...this.registry.values()].sort((a, b) => a.order - b.order);
  }

  getById(id: DashboardWidgetId): DashboardWidgetDefinition | undefined {
    return this.registry.get(id);
  }
}
