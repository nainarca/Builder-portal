import { Injectable } from '@angular/core';

import { BUILDER_DASHBOARD_WIDGETS } from '../config/builder-dashboard.config';
import { BuilderDashboardWidgetId, DashboardWidgetDefinition } from '../models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class WidgetRegistryService {
  private readonly registry = new Map<BuilderDashboardWidgetId, DashboardWidgetDefinition>(
    BUILDER_DASHBOARD_WIDGETS.map((widget) => [widget.id, widget]),
  );

  getAll(): readonly DashboardWidgetDefinition[] {
    return [...this.registry.values()].sort((a, b) => a.order - b.order);
  }

  getById(id: BuilderDashboardWidgetId): DashboardWidgetDefinition | undefined {
    return this.registry.get(id);
  }
}
